import { services } from "@/data/services-data"
import { notFound } from "next/navigation"
import { BookingStepper } from "@/components/booking/BookingStepper"
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Star,
  Shield,
  Award,
  CheckCircle,
  Sparkles,
  Users,
  Zap,
  Heart,
} from "lucide-react"
import Link from "next/link"
import { AddToBookingButton } from "@/components/booking/add-to-booking-button"
import {
  FadeInDiv,
  FadeInUp,
  SlideInLeft,
  SlideInRight,
  ScaleIn,
  FeatureCard,
  AnimatedIcon,
  HoverButton,
} from "@/components/booking/framer"

interface PageProps {
  params: Promise<{
    serviceId: string
  }>
}

const serviceFeatures = [
  {
    icon: Shield,
    title: "Fully Insured",
    description: "Complete protection for your property",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Award,
    title: "Professional Grade",
    description: "Industrial equipment & eco-friendly products",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: CheckCircle,
    title: "Satisfaction Guaranteed",
    description: "100% satisfaction or we'll make it right",
    gradient: "from-purple-500 to-pink-600",
  },
]

const additionalFeatures = [
  {
    icon: Users,
    title: "Experienced Team",
    description: "Certified professionals with years of experience",
  },
  {
    icon: Zap,
    title: "Quick Service",
    description: "Fast and efficient cleaning solutions",
  },
  {
    icon: Heart,
    title: "Eco-Friendly",
    description: "Safe for your family and pets",
  },
]

export default async function ServiceDetailPage({ params }: PageProps) {
  const { serviceId } = await params
  const service = services.find((s) => s.id === serviceId)

  if (!service) {
    return notFound()
  }

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case "custom-services":
        return {
          gradient: "from-purple-500 to-pink-600",
          bgGradient:
            "from-purple-50/70 to-pink-100/70 dark:from-purple-900/20 dark:to-pink-800/20",
          icon: "🎯",
        }
      case "carpet-cleaning":
        return {
          gradient: "from-blue-500 to-indigo-600",
          bgGradient:
            "from-blue-50/70 to-indigo-100/70 dark:from-blue-900/20 dark:to-indigo-800/20",
          icon: "🧽",
        }
      case "additional-cleaning":
        return {
          gradient: "from-emerald-500 to-teal-600",
          bgGradient:
            "from-emerald-50/70 to-teal-100/70 dark:from-emerald-900/20 dark:to-teal-800/20",
          icon: "✨",
        }
      default:
        return {
          gradient: "from-slate-500 to-slate-600",
          bgGradient:
            "from-slate-50/70 to-slate-100/70 dark:from-slate-900/20 dark:to-slate-800/20",
          icon: "🔧",
        }
    }
  }

  const categoryInfo = getCategoryGradient(service.category)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <SlideInLeft>
          <Link
            href={`/book/services/${service.category}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium mb-8 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 group"
          >
            <AnimatedIcon>
              <ArrowLeft className="mr-2 h-5 w-5" />
            </AnimatedIcon>
            <span>
              Back to {service.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
          </Link>
        </SlideInLeft>

        {/* Header Section */}
        <FadeInUp delay={0.1} className="text-center mb-8">
          <ScaleIn
            delay={0.2}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 px-4 py-2 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Service Details</span>
          </ScaleIn>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {service.name}
            </span>
          </h1>

          <FadeInDiv
            delay={0.3}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-6"
          >
            {service.description}
          </FadeInDiv>
        </FadeInUp>

        {/* Booking Stepper */}
        <BookingStepper />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Overview Card */}
            <FadeInDiv
              delay={0.4}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Service Overview
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Everything you need to know about this service
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <FadeInDiv
                  delay={0.5}
                  className="flex items-center space-x-3 p-4 bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-800/20 rounded-xl border border-blue-200/30 dark:border-blue-700/30"
                >
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Price</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      ${service.price}
                    </p>
                  </div>
                </FadeInDiv>

                <FadeInDiv
                  delay={0.55}
                  className="flex items-center space-x-3 p-4 bg-gradient-to-br from-emerald-50/50 to-teal-100/50 dark:from-emerald-900/20 dark:to-teal-800/20 rounded-xl border border-emerald-200/30 dark:border-emerald-700/30"
                >
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Duration</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {service.duration}
                    </p>
                  </div>
                </FadeInDiv>

                <FadeInDiv
                  delay={0.6}
                  className="flex items-center space-x-3 p-4 bg-gradient-to-br from-yellow-50/50 to-orange-100/50 dark:from-yellow-900/20 dark:to-orange-800/20 rounded-xl border border-yellow-200/30 dark:border-yellow-700/30"
                >
                  <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Rating</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        4.9
                      </span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </FadeInDiv>
              </div>
            </FadeInDiv>

            {/* Features Grid */}
            <FadeInDiv
              delay={0.5}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Why Choose This Service?
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Professional quality you can trust
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceFeatures.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    index={index}
                    className="p-6 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl border border-slate-200/30 dark:border-slate-700/30 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </FeatureCard>
                ))}
              </div>
            </FadeInDiv>

            {/* Additional Features */}
            <FadeInDiv
              delay={0.8}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Additional Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {additionalFeatures.map((feature, index) => (
                  <SlideInLeft
                    key={index}
                    delay={0.9 + index * 0.1}
                    className="flex items-start space-x-3 p-4 bg-gradient-to-br from-slate-50/30 to-slate-100/30 dark:from-slate-800/30 dark:to-slate-900/30 rounded-xl"
                  >
                    <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg">
                      <feature.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {feature.description}
                      </p>
                    </div>
                  </SlideInLeft>
                ))}
              </div>
            </FadeInDiv>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <SlideInRight delay={0.6}>
              <div className="sticky top-8">
                <div
                  className={`bg-gradient-to-br ${categoryInfo.bgGradient} backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg`}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      Ready to Book?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Professional service at an affordable price
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <FadeInDiv
                      delay={0.7}
                      className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl"
                    >
                      <span className="text-slate-600 dark:text-slate-400">Service Price:</span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        ${service.price}
                      </span>
                    </FadeInDiv>

                    <FadeInDiv
                      delay={0.75}
                      className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl"
                    >
                      <span className="text-slate-600 dark:text-slate-400">Duration:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {service.duration}
                      </span>
                    </FadeInDiv>
                  </div>

                  <AddToBookingButton service={service} />

                  <FadeInDiv
                    delay={0.8}
                    className="mt-6 p-4 bg-white/30 dark:bg-slate-800/30 rounded-xl"
                  >
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Free consultation included</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mt-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Same-day booking available</span>
                    </div>
                  </FadeInDiv>
                </div>
              </div>
            </SlideInRight>
          </div>
        </div>

        {/* Call to Action */}
        <FadeInDiv delay={1.0} className="text-center mb-12">
          <div className="bg-gradient-to-br from-blue-50/70 to-indigo-100/70 dark:from-blue-900/20 dark:to-indigo-800/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/50 dark:border-blue-700/50">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Questions About This Service?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
              Our team is here to help you choose the right cleaning solution for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <HoverButton className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl group">
                  <span>Contact Us</span>
                  <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform duration-200" />
                </HoverButton>
              </Link>
              <Link href={`/book/services/${service.category}`}>
                <HoverButton className="inline-flex items-center space-x-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-semibold hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow-lg">
                  <ArrowLeft className="w-5 h-5" />
                  <span>View Similar Services</span>
                </HoverButton>
              </Link>
            </div>
          </div>
        </FadeInDiv>

        {/* Footer */}
        <FadeInDiv delay={1.2} className="text-center">
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
