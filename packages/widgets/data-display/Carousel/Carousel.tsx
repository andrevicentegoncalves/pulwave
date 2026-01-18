import React, { useState, useEffect, useRef, Children, ReactNode, useCallback } from 'react';
import { classNames } from '@pulwave/utils';
import { ChevronLeft, ChevronRight } from '@pulwave/ui';
import { carouselVariants, type CarouselProps } from './types';
import './styles/_index.scss';

export const Carousel = ({
    slides,
    children,
    autoPlay = false,
    interval = 5000,
    showDots = true,
    showArrows = true,
    loop = true,
    slidesToShow = 1,
    variant = 'default',
    className,
    onChange
}: CarouselProps) => {
    const items = slides ? slides.map(s => s.content) : Children.toArray(children);
    const total = items.length;
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

    const goTo = useCallback((index: number) => {
        let next = index;
        if (loop) {
            if (next < 0) next = total - 1;
            if (next >= total) next = 0;
        } else {
            next = Math.max(0, Math.min(next, total - 1));
        }
        setCurrent(next);
        onChange?.(next);
    }, [loop, total, onChange]);

    const prev = useCallback(() => goTo(current - 1), [goTo, current]);
    const next = useCallback(() => goTo(current + 1), [goTo, current]);

    useEffect(() => {
        if (autoPlay && total > 1) {
            intervalRef.current = setInterval(next, interval);
            return () => clearInterval(intervalRef.current);
        }
    }, [autoPlay, interval, next, total]);

    return (
        <div className={classNames(carouselVariants({ variant, withArrows: showArrows && total > 1 }), className)}>
            <div className="carousel__viewport">
                <div
                    className="carousel__track"
                    style={{
                        transform: `translateX(-${current * (100 / slidesToShow)}%)`,
                    }}
                >
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className={classNames('carousel__slide', i === current && 'carousel__slide--active')}
                            style={{ flex: `0 0 ${100 / slidesToShow}%` }}
                            onClick={() => {
                                if (i !== current) goTo(i);
                            }}
                            onKeyDown={(e) => {
                                if ((e.key === 'Enter' || e.key === ' ') && i !== current) {
                                    e.preventDefault();
                                    goTo(i);
                                }
                            }}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`Slide ${i + 1} of ${total}`}
                            tabIndex={i === current ? 0 : -1}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {showArrows && total > 1 && (
                <>
                    <button type="button" className="carousel__arrow carousel__arrow--prev" onClick={prev} aria-label="Previous">
                        <ChevronLeft size={20} aria-hidden="true" />
                    </button>
                    <button type="button" className="carousel__arrow carousel__arrow--next" onClick={next} aria-label="Next">
                        <ChevronRight size={20} aria-hidden="true" />
                    </button>
                </>
            )}

            {showDots && total > 1 && (
                <div className="carousel__controls">
                    <div className="carousel__dots">
                        {items.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                className={classNames('carousel__dot', i === current && 'carousel__dot--active')}
                                onClick={() => goTo(i)}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
Carousel.displayName = 'Carousel';
