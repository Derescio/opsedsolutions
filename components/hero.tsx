"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, BarChart3, Code, Database, LayoutDashboard, Zap } from "lucide-react"
import { useEffect, useState } from "react"

export default function Hero() {
  const [currentMetric, setCurrentMetric] = useState(0)

  const metrics = [
    { label: "Apps Built with Next.js", value: "25+", icon: Code },
    { label: "PostgreSQL Databases", value: "30+", icon: Database },
    { label: "Figma Designs", value: "60+", icon: LayoutDashboard },
    { label: "Power BI Dashboards", value: "20+", icon: BarChart3 },
  ];


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % metrics.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [metrics.length])

  return (
    <section
      id="home"
      className="mt-16 min-h-screen flex items-center justify-center px-4 pt-20 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0376aa]/10 via-transparent to-[#32cf37]/10 dark:from-[#0376aa]/20 dark:via-transparent dark:to-[#32cf37]/20"></div>

      {/* Animated Pixel Elements */}
      <div className="absolute inset-0 opacity-30 overflow-hidden">
        <div className="absolute top-20 left-20 w-4 h-4 bg-[#0376aa] rounded-sm animate-pulse"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-[#32cf37] rounded-sm animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-40 w-5 h-5 bg-[#0376aa] rounded-sm animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-[#32cf37] rounded-sm animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-10 w-4 h-4 bg-[#0376aa] rounded-sm animate-pulse delay-1500"></div>
        <div className="absolute top-1/3 right-10 w-3 h-3 bg-[#32cf37] rounded-sm animate-pulse delay-3000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-[#0376aa] dark:text-[#0376aa] font-medium mb-6 border border-[#0376aa]/20 shadow-sm">
                <Zap className="w-4 h-4 mr-2" />
                <span className="text-sm sm:text-base">Optimizing Systems for Enterprise Development</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                <span className="text-[#0376aa]">Smarter</span> Web
                <br />
                <span className="text-[#32cf37]">Platforms</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-white dark:font-light mb-8 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Full-stack development meets advanced data analytics. I transform complex business challenges into
                scalable web solutions backed by data-driven insights.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12">
              <Button
                size="lg"
                className="bg-[#0376aa] hover:bg-[#025a8a] text-white px-6 sm:px-8 py-4 text-base sm:text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Code className="mr-2 h-5 w-5" />
                View My Work
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[#32cf37] text-[#32cf37] hover:bg-[#32cf37] hover:text-white px-6 sm:px-8 py-4 text-base sm:text-lg rounded-lg transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm w-full sm:w-auto"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Database className="mr-2 h-5 w-5" />
                Start Your Project
              </Button>
            </div>

            {/* Services Preview */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="text-center p-3 sm:p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <Code className="w-6 h-6 sm:w-8 sm:h-8 text-[#0376aa] mx-auto mb-2" />
                <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Full-Stack Development</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <Database className="w-6 h-6 sm:w-8 sm:h-8 text-[#32cf37] mx-auto mb-2" />
                <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Data Analytics</div>
              </div>
            </div>
          </div>

          {/* Right Column - Metrics & Visual */}
          <div className="relative mt-8 lg:mt-0">
            {/* Animated Metrics Card */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Real Impact</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Measurable results for every project</p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {metrics.map((metric, index) => {
                  const Icon = metric.icon
                  const isActive = index === currentMetric

                  return (
                    <div
                      key={metric.label}
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-lg transition-all duration-500 ${isActive
                        ? 'bg-gradient-to-r from-[#0376aa]/10 to-[#32cf37]/10 border-l-4 border-[#0376aa] scale-105'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                    >
                      <div className="flex items-center min-w-0 flex-1">
                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mr-3 flex-shrink-0 ${isActive ? 'text-[#0376aa]' : 'text-gray-500 dark:text-gray-400'}`} />
                        <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{metric.label}</span>
                      </div>
                      <span className={`text-lg sm:text-2xl font-bold flex-shrink-0 ml-2 ${isActive ? 'text-[#32cf37]' : 'text-gray-700 dark:text-gray-300'}`}>
                        {metric.value}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#0376aa] to-[#32cf37] rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#32cf37] to-[#0376aa] rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="animate-bounce cursor-pointer" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
            <ArrowDown className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 dark:text-gray-500 mx-auto" />
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">Discover Our Projects</p>
        </div>
      </div>
    </section>
  )
}
