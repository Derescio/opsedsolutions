'use client'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Clock, Send, MessageSquare, Calendar } from "lucide-react"
import { sendEmail } from "@/lib/actions/email-sender"
import { useState } from "react"
import { toast } from "sonner"

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "opsedsolutions@gmail.com",
    href: "mailto:opsedsolutions@gmail.com",
    color: "#0376aa"
  },
  // {
  //   icon: Phone,
  //   label: "Phone",
  //   value: "+1 (555) 123-4567",
  //   href: "tel:+15551234567",
  //   color: "#32cf37"
  // },
  {
    icon: MapPin,
    label: "Location",
    value: "Remote Work",
    href: null,
    color: "#0376aa"
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 24 hours",
    href: null,
    color: "#32cf37"
  }
]

const services = [
  "Custom Web Application Development",
  "Data Analytics & Business Intelligence",
  "System Architecture & Optimization",
  "API Development & Integration",
  "Database Design & Management",
  "UX/UI Design",
  "UX/UI Auditing",
  "Technical Consulting"
]

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)

    try {
      const result = await sendEmail(formData)
      if (result.success) {
        toast.success("Message sent successfully! I'll get back to you within 24 hours.")
        // Reset form fields manually
        const form = document.querySelector('form') as HTMLFormElement
        if (form) {
          form.reset()
        }
      } else {
        toast.error("Failed to send message. Please try again or email me directly.")
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again or email me directly." + error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 px-4 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-full text-[#0376aa] font-medium mb-6 border border-[#0376aa]/20 shadow-sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Get In Touch
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Let&apos;s Build Something <span className="text-[#0376aa]">Amazing</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Ready to transform your business with cutting-edge technology and data-driven insights? Let&apos;s discuss your project.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>
                <div className="space-y-6">
                  {contactInfo.map((item) => {
                    const Icon = item.icon
                    const content = (
                      <div className="flex items-start space-x-4 group">
                        <div
                          className="p-3 rounded-lg group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: `${item.color}15` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: item.color }} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">{item.label}</div>
                          <div className="text-gray-600 dark:text-gray-300 mt-1">{item.value}</div>
                        </div>
                      </div>
                    )

                    return item.href ? (
                      <a key={item.label} href={item.href} className="block hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded-lg transition-colors">
                        {content}
                      </a>
                    ) : (
                      <div key={item.label} className="p-2">
                        {content}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Services Overview */}
            <Card className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Services Available</h3>
                <div className="space-y-3">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-[#0376aa] to-[#32cf37] rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            {/* <Card className="bg-gradient-to-r from-[#0376aa] to-[#32cf37] text-white border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold mb-4">Connect With Me</h3>
                <div className="flex justify-center space-x-4">
                  <a
                    href="https://linkedin.com/in/yourprofile"
                    className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a
                    href="mailto:hello@opsedsolutions.com"
                    className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    aria-label="Send Email"
                  >
                    <Mail className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    aria-label="Schedule Meeting"
                  >
                    <Calendar className="w-6 h-6" />
                  </a>
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Start Your Project</h3>
                <form action={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name *
                      </label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className="w-full bg-gray-50 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        className="w-full bg-gray-50 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full bg-gray-50 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white"
                        placeholder="john@company.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company
                      </label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        className="w-full bg-gray-50 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white"
                        placeholder="Your Company"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Type
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      className="w-full p-3 bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0376aa] focus:border-transparent"
                    >
                      <option value="">Select a service</option>
                      <option value="web-development">Web Application Development</option>
                      <option value="data-analytics">Data Analytics & BI</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Budget
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      className="w-full p-3 bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0376aa] focus:border-transparent"
                    >
                      <option value="">Select budget range</option>
                      <option value="1k-5k">$1,000 - $5,000</option>
                      <option value="5k-15k">$5,000 - $15,000</option>
                      <option value="15k-50k">$15,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k+">$100,000+</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Details *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      className="w-full bg-gray-50 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white"
                      placeholder="Tell me about your project goals, timeline, and any specific requirements..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-[#0376aa] hover:bg-[#025a8a] disabled:bg-gray-400 text-white py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                    {/* <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-[#32cf37] text-[#32cf37] hover:bg-[#32cf37] hover:text-white py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Call
                    </Button> */}
                  </div>


                </form>

                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                    <strong>Quick Response Guarantee:</strong> I&apos;ll get back to you within 24-48 hours with a draft proposal and next steps.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              Whether you need a complete digital transformation or want to optimize your existing systems,
              I&apos;m here to help you achieve your business goals through technology and data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-[#0376aa] hover:bg-[#025a8a] text-white px-8 py-3 rounded-lg transition-colors"
                onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              >
                View Services
              </Button>
              <Button
                variant="outline"
                className="border-[#32cf37] text-[#32cf37] hover:bg-[#32cf37] hover:text-white px-8 py-3 rounded-lg transition-colors"
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              >
                See Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
