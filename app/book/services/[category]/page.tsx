import { notFound } from "next/navigation"
import { ServiceCard } from "@/components/booking/ServiceCard"
import { BookingStepper } from "@/components/booking/BookingStepper"
import { ArrowLeft, Sparkles, Filter, Grid3X3 } from "lucide-react"
import Link from "next/link"
import { services } from "@/data/services-data"
import {
  FadeInDiv,
  FadeInUp,
  SlideInLeft,
  ScaleIn,
  StaggeredList,
  AnimatedIcon,
  HoverButton,
} from "@/components/booking/framer"

interface PageProps {
  params: Promise<{
    category: string
  }>
}

export default async function ServicesPage(props: PageProps) {
  const { category } = await props.params
  const categoryServices = services.filter((s) => s.category === category)

  if (categoryServices.length === 0) {
    return notFound()
  }

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case "custom-services":
        return {
          name: "Custom Jobs",
          description: "Tailored cleaning solutions for unique requirements",
          gradient: "from-purple-500 to-pink-600",
          bgGradient:
            "from-purple-50/70 to-pink-100/70 dark:from-purple-900/20 dark:to-pink-800/20",
          icon: "🎯",
        }
      case "carpet-cleaning":
        return {
          name: "Carpet Cleaning",
          description: "Professional deep cleaning for all carpet types",
          gradient: "from-blue-500 to-indigo-600",
          bgGradient:
            "from-blue-50/70 to-indigo-100/70 dark:from-blue-900/20 dark:to-indigo-800/20",
          icon: "🧽",
        }
      case "additional-cleaning":
        return {
          name: "Additional Cleaning",
          description: "Comprehensive cleaning services beyond carpets",
          gradient: "from-emerald-500 to-teal-600",
          bgGradient:
            "from-emerald-50/70 to-teal-100/70 dark:from-emerald-900/20 dark:to-teal-800/20",
          icon: "✨",
        }
      default:
        return {
          name: category,
          description: "Professional cleaning services",
          gradient: "from-slate-500 to-slate-600",
          bgGradient:
            "from-slate-50/70 to-slate-100/70 dark:from-slate-900/20 dark:to-slate-800/20",
          icon: "🔧",
        }
    }
  }

  const categoryInfo = getCategoryInfo(category)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <SlideInLeft>
          <Link
            href="/book"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium mb-8 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 group"
          >
            <AnimatedIcon>
              <ArrowLeft className="mr-2 h-5 w-5" />
            </AnimatedIcon>
            <span>Back to Services</span>
          </Link>
        </SlideInLeft>

        {/* Header Section */}
        <FadeInUp delay={0.1} className="text-center mb-8">
          <ScaleIn
            delay={0.2}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 px-4 py-2 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Professional Services</span>
          </ScaleIn>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AB Carpet Cleaning
            </span>
          </h1>

          <ScaleIn
            delay={0.4}
            className={`inline-flex items-center space-x-3 bg-gradient-to-br ${categoryInfo.bgGradient} backdrop-blur-sm rounded-2xl px-6 py-4 border border-slate-200/50 dark:border-slate-700/50 mb-4`}
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryInfo.gradient} flex items-center justify-center text-white text-xl shadow-lg`}
            >
              {categoryInfo.icon}
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {categoryInfo.name}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {categoryInfo.description}
              </p>
            </div>
          </ScaleIn>
        </FadeInUp>

        {/* Booking Stepper */}
        <BookingStepper />

        {/* Services Header */}
        <FadeInDiv
          delay={0.3}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50"
        >
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Grid3X3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Available Services
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {categoryServices.length} service{categoryServices.length !== 1 ? "s" : ""}{" "}
                available
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <Filter className="w-4 h-4" />
            <span>Sorted by popularity</span>
          </div>
        </FadeInDiv>

        {/* Services Grid */}
        <StaggeredList className="space-y-6 mb-12">
          {categoryServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </StaggeredList>

        {/* CALL TO ACTION */}
        {(category === "additional-cleaning" || category === "carpet-cleaning") && (
          <FadeInUp delay={0.6} className="text-center mb-12">
            <div className="bg-gradient-to-br from-blue-50/70 to-indigo-100/70 dark:from-blue-900/20 dark:to-indigo-800/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/50 dark:border-blue-700/50">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Can&apos;t find what you&apos;re looking for?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
                We offer custom cleaning solutions tailored to your specific needs. Contact us for a
                personalized quote.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/book/services/custom-services">
                  <HoverButton className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl group">
                    <span>View Custom Services</span>
                    <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform duration-200" />
                  </HoverButton>
                </Link>
                <Link href="/book">
                  <HoverButton className="inline-flex items-center space-x-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-semibold hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow-lg">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Browse All Categories</span>
                  </HoverButton>
                </Link>
              </div>
            </div>
          </FadeInUp>
        )}

        {/* Footer */}
        <FadeInDiv delay={0.8} className="text-center">
          <div className="inline-flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm bg-white/50 dark:bg-slate-800/50 px-6 py-3 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>
              Copyright &copy; {new Date().getFullYear()}{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">Web Nurture</span>
            </span>
          </div>
        </FadeInDiv>
      </div>
    </div>
  )
}
