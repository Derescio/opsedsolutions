import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { userHelpers } from '@/lib/db'

type WebhookEvent = {
  data: {
    id: string
    email_addresses: Array<{
      email_address: string
      id: string
    }>
    first_name: string | null
    last_name: string | null
    image_url: string
    phone_numbers: Array<{
      phone_number: string
      id: string
    }>
    public_metadata: {
      role?: 'ADMIN' | 'CLIENT' | 'SUPPORT' | 'MODERATOR'
    }
    private_metadata: Record<string, unknown>
  }
  object: 'event'
  type: 'user.created' | 'user.updated' | 'user.deleted'
}

export async function POST(req: Request) {
  console.log('🔄 Clerk webhook received')
  
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  console.log('📋 Webhook headers:', {
    svix_id: svix_id ? 'present' : 'missing',
    svix_timestamp: svix_timestamp ? 'present' : 'missing',
    svix_signature: svix_signature ? 'present' : 'missing'
  })

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ Missing svix headers')
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  console.log('📦 Webhook payload type:', payload.type)
  console.log('👤 User ID:', payload.data?.id)

  // Check if webhook secret is configured
  if (!process.env.CLERK_WEBHOOK_SECRET) {
    console.error('❌ CLERK_WEBHOOK_SECRET is not configured')
    return new Response('Webhook secret not configured', {
      status: 500,
    })
  }

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
    console.log('✅ Webhook signature verified')
  } catch (err) {
    console.error('❌ Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type
  console.log('🎯 Processing event type:', eventType)
  
  try {
    switch (eventType) {
      case 'user.created':
      case 'user.updated':
        await handleUserUpsert(evt)
        break
      case 'user.deleted':
        await handleUserDelete(evt)
        break
      default:
        console.log(`⚠️ Unhandled event type: ${eventType}`)
    }
  } catch (error) {
    console.error('❌ Error processing webhook:', error)
    return new Response('Error processing webhook', {
      status: 500,
    })
  }

  console.log('✅ Webhook processed successfully')
  return NextResponse.json({ success: true })
}

async function handleUserUpsert(evt: WebhookEvent) {
  const { data } = evt
  
  // Extract email (primary email)
  const primaryEmail = data.email_addresses.find(
    (email) => email.id === data.email_addresses[0]?.id
  )
  
  if (!primaryEmail) {
    console.error('No primary email found for user:', data.id)
    return
  }

  // Extract phone number (primary phone)
  const primaryPhone = data.phone_numbers.find(
    (phone) => phone.id === data.phone_numbers[0]?.id
  )

  // Prepare user data
  const userData = {
    email: primaryEmail.email_address,
    firstName: data.first_name ?? undefined,
    lastName: data.last_name ?? undefined,
    imageUrl: data.image_url,
    phone: primaryPhone?.phone_number,
  }

  // Create or update user in database
  const user = await userHelpers.upsertUser(data.id, userData)

  // Update role if specified in public metadata
  if (data.public_metadata?.role) {
    await userHelpers.updateUserRole(data.id, data.public_metadata.role)
  }

  console.log('User synced successfully:', user.id)
}

async function handleUserDelete(evt: WebhookEvent) {
  const { data } = evt
  
  try {
    // Instead of deleting, deactivate the user to preserve ticket history
    await userHelpers.updateUserRole(data.id, 'CLIENT') // Reset to client role
    // You might want to add a soft delete field to your schema
    console.log('User deactivated:', data.id)
  } catch (error) {
    console.error('Error deactivating user:', error)
  }
} 