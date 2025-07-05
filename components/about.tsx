'use client'
import { Card, CardContent } from "@/components/ui/card"
import { Code, Database, TrendingUp, Users, Award, Coffee } from "lucide-react"

const skills = [
  { name: "Full-Stack Development", category: "Development", icon: Code, color: "#0376aa" },
  { name: "Data Analytics", category: "Analytics", icon: Database, color: "#32cf37" },
  { name: "Machine Learning", category: "AI/ML", icon: TrendingUp, color: "#0376aa" },
  { name: "Team Leadership", category: "Management", icon: Users, color: "#32cf37" },
  { name: "System Architecture", category: "Design", icon: Award, color: "#0376aa" },
  { name: "Business Intelligence", category: "Strategy", icon: Coffee, color: "#32cf37" },
]

const technologies = [
  { name: "React/Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Language" },
  { name: "PostgreSQL", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "AWS/Azure", category: "Cloud" },
  { name: "Docker", category: "DevOps" },
  { name: "Pandas/NumPy", category: "Data Science" },
  { name: "TensorFlow", category: "ML/AI" },
  { name: "Tableau", category: "Visualization" },
  { name: "Apache Spark", category: "Big Data" },
]

const achievements = [
  { metric: "5+", label: "Years Experience" },
  { metric: "50+", label: "Projects Completed" },
  { metric: "15+", label: "Enterprise Clients" },
  { metric: "99.9%", label: "Client Satisfaction" },
]

export default function About() {
  return (
    <section id="about" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-[#0376aa] font-medium mb-6 border border-[#0376aa]/20 shadow-sm">
            <Users className="w-4 h-4 mr-2" />
            About Opsed Solutions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Expertise That <span className="text-[#0376aa]">Delivers</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Combining full-stack development mastery with advanced data analytics to create solutions that drive real business growth
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Story & Achievements */}
          <div className="space-y-8">
            {/* Professional Story */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Journey</h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p>
                    With over 5 years of experience bridging the gap between technology and data-driven insights,
                    I founded Opsed Solutions to help enterprises optimize their digital infrastructure and unlock
                    the power of their data.
                  </p>
                  <p>
                    My unique combination of full-stack development expertise and advanced analytics allows me to
                    build end-to-end solutions that not only function beautifully but are also backed by
                    data-driven decision making.
                  </p>
                  <p>
                    From Fortune 500 companies to innovative startups, I&apos;ve helped organizations transform their
                    operations through scalable web applications, intelligent dashboards, and predictive analytics
                    that drive measurable business results.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Track Record</h3>
                <div className="grid grid-cols-2 gap-6">
                  {achievements.map((achievement) => (
                    <div key={achievement.label} className="text-center">
                      <div className="text-3xl font-bold text-[#0376aa] mb-2">{achievement.metric}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{achievement.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Skills & Technologies */}
          <div className="space-y-8">
            {/* Core Skills */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Core Expertise</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {skills.map((skill) => {
                    const Icon = skill.icon
                    return (
                      <div
                        key={skill.name}
                        className="flex items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                      >
                        <div
                          className="p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: `${skill.color}15` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: skill.color }} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">{skill.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{skill.category}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Technologies */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Technologies & Tools</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {technologies.map((tech) => (
                    <div
                      key={tech.name}
                      className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-[#0376aa] to-[#32cf37] rounded-lg mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white font-semibold text-sm">{tech.name.charAt(0)}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{tech.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{tech.category}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-[#0376aa] to-[#32cf37] text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Business?</h3>
              <p className="text-lg opacity-90 max-w-2xl mx-auto mb-6">
                Let&apos;s discuss how my expertise in full-stack development and data analytics can drive your next project to success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="bg-white text-[#0376aa] hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors"
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Let&apos;s Connect
                </button>
                <button
                  className="border border-white text-white hover:bg-white hover:text-[#0376aa] px-8 py-3 rounded-lg font-medium transition-colors"
                  onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                >
                  View My Work
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
