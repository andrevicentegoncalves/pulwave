/**
 * AnatomyDiagram Component
 * 
 * Visual anatomy diagram with numbered parts list.
 * Shows component structure with callouts.
 */
import React from 'react';
import { Text } from "@pulwave/ui";

export interface AnatomyPart {
    name: string;
    description: string;
    number?: number;
}

export interface AnatomyDiagramProps {
    /** Anatomy parts to display */
    parts: AnatomyPart[];
    /** Optional image showing component anatomy */
    image?: string;
    /** Image alt text */
    imageAlt?: string;
    /** Additional class name */
    className?: string;
}

export const AnatomyDiagram = ({
    parts,
    image,
    imageAlt = 'Component anatomy diagram',
    className = '',
}: AnatomyDiagramProps) => {
    if (!parts?.length) return null;

    return (
        <div className={`anatomy-diagram ${className}`}>
            {image && (
                <div className="anatomy-diagram__image-wrapper">
                    <img
                        src={image}
                        alt={imageAlt}
                        className="anatomy-diagram__image"
                        width={600}
                        height={400}
                    />
                </div>
            )}

            <ol className="anatomy-diagram__list">
                {parts.map((part, index) => (
                    <li key={index} className="anatomy-diagram__item">
                        <span className="anatomy-diagram__number">{part.number ?? index + 1}</span>
                        <div className="anatomy-diagram__content">
                            <Text as="strong" weight="bold" className="anatomy-diagram__name">{part.name}</Text>
                            <Text as="span" className="anatomy-diagram__description">{part.description}</Text>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
};

AnatomyDiagram.displayName = 'AnatomyDiagram';

export default AnatomyDiagram;
