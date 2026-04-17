"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const testimonials = [
    {
        quote: "JobFlow helped me track over 50 applications and finally land my dream job at a tech startup. The AI resume review was a game changer!",
        author: "Michael Chen",
        role: "Software Engineer"
    },
    {
        quote: "I love how organized my job search became. The activity dashboard helped me see my progress and stay motivated throughout the process.",
        author: "Sarah Williams",
        role: "Product Manager"
    },
    {
        quote: "The AI mock interview feature helped me prepare for my interviews. I got the job offer after my very first interview round!",
        author: "James Rodriguez",
        role: "Data Analyst"
    },
    {
        quote: "Being self-hosted was a huge plus for me. I have complete control over my data while using powerful AI tools for my job search.",
        author: "Emily Davis",
        role: "DevOps Engineer"
    },
    {
        quote: "The cover letter generator saved me hours of work. Each letter was perfectly tailored to the job description.",
        author: "Alex Thompson",
        role: "UX Designer"
    }
];

export function LandingTestimonials() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const visibleCount = 3;
    const maxIndex = testimonials.length - visibleCount;

    const handlePrev = () => {
        if (isAnimating || currentIndex === 0) return;
        setIsAnimating(true);
        setCurrentIndex(prev => prev - 1);
        setTimeout(() => setIsAnimating(false), 300);
    };

    const handleNext = () => {
        if (isAnimating || currentIndex >= maxIndex) return;
        setIsAnimating(true);
        setCurrentIndex(prev => prev + 1);
        setTimeout(() => setIsAnimating(false), 300);
    };

    useEffect(() => {
        if (typeof window === "undefined") return;

        const ctx = gsap.context(() => {
            gsap.from(".testimonial-header", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                y: 30,
                opacity: 0,
                duration: 0.7,
                ease: "power3.out"
            });

            gsap.from(".testimonial-card", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none none"
                },
                y: 40,
                opacity: 0,
                duration: 0.7,
                stagger: 0.15,
                ease: "power3.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="w-full py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
            <div className="container px-6 md:px-8 max-w-6xl mx-auto">

                {/* Header */}
                <div className="testimonial-header flex items-start justify-between mb-12">
                    <div>
                        <p className="text-sm font-medium text-indigo-600 mb-2">Testimonials</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Loved by job seekers
                        </h2>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="hidden md:flex gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-200 ${currentIndex === 0
                                ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                                : 'border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50'
                                }`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentIndex >= maxIndex}
                            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-200 ${currentIndex >= maxIndex
                                ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                                : 'border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50'
                                }`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Testimonials Grid */}
                <div className="relative overflow-hidden">
                    <div
                        className="flex gap-6 transition-transform duration-300 ease-out"
                        style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
                    >
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className={`testimonial-card flex-shrink-0 w-full md:w-[calc(33.333%-16px)] bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300`}
                            >
                                <Quote className={`w-8 h-8 text-indigo-500/60 mb-6`} />
                                <p className="text-slate-600 leading-relaxed mb-6 font-medium">
                                    "{testimonial.quote}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                                        {testimonial.author.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">{testimonial.author}</p>
                                        <p className="text-xs text-slate-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Navigation Dots */}
                <div className="flex md:hidden justify-center gap-2 mt-8">
                    {Array.from({ length: testimonials.length }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(Math.min(index, maxIndex))}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex ? 'bg-indigo-600 w-6' : 'bg-slate-200'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
