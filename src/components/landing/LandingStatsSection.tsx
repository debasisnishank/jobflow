"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const stats = [
    { value: 10000, suffix: "+", label: "Active Users" },
    { value: 50000, suffix: "+", label: "Applications Tracked" },
    { value: 85, suffix: "%", label: "Success Rate" }
];

function AnimatedCounter({ value, suffix, duration = 2 }: { value: number; suffix: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const counterRef = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        hasAnimated.current = true;

                        const startTime = Date.now();
                        const endValue = value;

                        const animate = () => {
                            const elapsed = Date.now() - startTime;
                            const progress = Math.min(elapsed / (duration * 1000), 1);

                            // Easing function
                            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                            const currentValue = Math.floor(easeOutQuart * endValue);

                            setCount(currentValue);

                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            }
                        };

                        requestAnimationFrame(animate);
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => observer.disconnect();
    }, [value, duration]);

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + "K";
        }
        return num.toString();
    };

    return (
        <span ref={counterRef}>
            {formatNumber(count)}{suffix}
        </span>
    );
}

export function LandingStatsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const ctx = gsap.context(() => {
            gsap.from(".stat-item", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="w-full py-20 md:py-28 bg-gradient-to-br from-[#3B82F6]/10 via-white to-[#1D4ED8]/10 relative overflow-visible">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent overflow-hidden" />

            <div className="container px-4 sm:px-6 md:px-8 max-w-5xl mx-auto relative z-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-item p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-blue-100/50 shadow-sm">
                            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-blue-600 mb-2 tracking-tight">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            </div>
                            <p className="text-gray-600 text-base sm:text-lg font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="my-16 border-t border-gray-200" />

                {/* Company Logos */}
                <div className="text-center">
                    <p className="text-gray-500 text-sm mb-8 font-medium">Trusted by professionals from</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Google */}
                        <svg className="h-8 max-w-[100px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.49 12.275C23.49 11.485 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.25 17.21 15.81 18.16V21.16H19.66C21.915 19.115 23.2 16.09 23.49 12.275Z" fill="#4285F4" />
                            <path d="M12 24C15.17 24 17.81 22.97 19.77 21.16L15.89 18.16C14.855 18.845 13.535 19.24 12 19.24C8.955 19.24 6.37 17.2 5.46 14.48H1.47V17.51C3.44 21.365 7.425 24 12 24Z" fill="#34A853" />
                            <path d="M5.46 14.48C5.235 13.785 5.11 13.045 5.11 12.275C5.11 11.505 5.235 10.765 5.46 10.07V6.98H1.47C0.67 8.575 0.22 10.375 0.22 12.275C0.22 14.175 0.67 15.975 1.47 17.57L5.46 14.48Z" fill="#FBBC05" />
                            <path d="M12 5.38C13.725 5.38 15.265 5.975 16.48 7.125L19.94 3.73C17.81 1.77 15.17 0.61 12 0.61C7.425 0.61 3.44 3.245 1.47 7.095L5.46 10.185C6.37 7.465 8.955 5.38 12 5.38Z" fill="#EA4335" />
                        </svg>

                        {/* Microsoft */}
                        <svg className="h-8 max-w-[100px]" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0H10.8804V10.8804H0V0Z" fill="#F25022" />
                            <path d="M11.9678 0H22.8482V10.8804H11.9678V0Z" fill="#7FBA00" />
                            <path d="M0 11.9678H10.8804V22.8482H0V11.9678Z" fill="#00A4EF" />
                            <path d="M11.9678 11.9678H22.8482V22.8482H11.9678V11.9678Z" fill="#FFB900" />
                        </svg>

                        {/* Amazon */}
                        <svg className="h-8 max-w-[100px] text-gray-800" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.535 0.174988C14.735 4.39499 15.245 4.90499 16.595 5.56499C15.065 5.74499 12.925 6.03499 10.315 7.15499C13.045 4.96499 13.535 0.174988 13.535 0.174988Z" fill="currentColor" />
                            <path d="M11.165 14.865C6.545 16.895 6.375 19.345 9.165 19.895C14.195 20.895 15.545 15.715 11.165 14.865Z" fill="currentColor" />
                            <path d="M17.845 11.235C17.915 13.625 17.155 14.245 16.485 14.375C16.485 14.375 16.545 15.355 15.295 15.655C15.295 15.655 15.015 15.735 14.715 15.735C14.715 15.735 15.255 17.655 16.525 17.205C16.525 17.205 17.255 16.815 17.615 16.105C17.615 16.105 18.255 16.295 18.265 17.075C18.265 17.075 18.175 17.385 18.065 17.585C17.385 18.595 16.325 19.155 14.655 19.155C14.655 19.155 10.595 19.465 6.435 17.915C4.265 17.105 3.515 14.995 4.295 12.925C5.075 10.845 7.025 9.09499 11.375 8.76499C11.375 8.76499 14.755 8.35499 16.195 8.34499C16.195 8.34499 16.365 7.15499 15.155 6.94499C15.155 6.94499 12.835 6.56499 10.875 8.24499C10.875 8.24499 10.515 7.11499 10.865 6.74499C10.865 6.74499 14.185 4.61499 17.475 6.32499C17.475 6.32499 18.145 6.84499 17.845 11.235Z" fill="currentColor" />
                        </svg>

                        {/* Meta */}
                        <svg className="h-6 max-w-[100px] text-blue-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.92 12.44C15.93 11.35 15.35 9.94 15.35 8.44C15.35 5.54 13.9 4 12.06 4C10.61 4 9.61 4.96 8.77 5.86L8.73 5.9C7.8 6.9 7.02 7.74 5.99 7.74C4.38 7.74 3.12 6.55 3.12 4.93C3.12 4.67 3.15 4.41 3.2 4.16C3.25 3.91 3.2 3.65 3.06 3.44C2.92 3.23 2.68 3.11 2.43 3.12C1.07 3.18 0 4.29 0 5.66C0 8.01 1.88 9.96 4.2 9.96C5.52 9.96 6.39 9.17 7.21 8.3L7.25 8.26C8.2 7.25 8.95 6.44 9.96 6.44C10.74 6.44 11.24 6.94 11.24 7.64C11.24 8.71 10.38 9.77 9.4 10.83C8.16 12.18 6.75 13.72 6.75 16C6.75 18.9 8.2 20.44 10.04 20.44C11.49 20.44 12.49 19.48 13.33 18.58L13.37 18.54C14.3 17.54 15.08 16.7 16.11 16.7C17.72 16.7 18.98 17.89 18.98 19.51C18.98 19.77 18.95 20.03 18.9 20.28C18.85 20.53 18.9 20.79 19.04 21C19.18 21.21 19.42 21.33 19.67 21.32C21.03 21.26 22.1 20.15 22.1 18.78C22.1 16.43 20.22 14.48 17.9 14.48C16.58 14.48 15.71 15.27 14.89 16.14L14.85 16.18C13.9 17.19 13.15 18 12.14 18C11.36 18 10.86 17.5 10.86 16.8C10.86 15.73 11.72 14.67 12.7 13.61C13.94 12.26 15.35 10.72 15.35 8.44C15.35 8.29 15.34 8.13 15.33 7.97C16.03 8.35 16.58 8.94 16.92 9.68L16.92 12.44Z" />
                        </svg>

                        {/* Apple */}
                        <svg className="h-8 max-w-[100px] text-gray-900" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.71 19.5C17.88 20.74 17.03 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.97C7.79 22 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.66 2.67 14.06 1.53 13.94 0.4C12.96 0.44 11.77 1.05 11.06 1.88C10.43 2.61 9.87 3.8 10 4.93C11.11 5.01 12.28 4.31 13 3.5Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}
