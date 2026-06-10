import React from "react";

type CardProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  floating?: boolean;
};

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  icon,
  className = "",
  onClick,
  floating = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative
        bg-white rounded-2xl p-5 transition-all
        ${
          floating
            ? "shadow-xl hover:-translate-y-1 hover:shadow-2xl"
            : "shadow-md"
        }
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >

      {(title || subtitle) && (
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {title && (
              <h2 className="text-lg font-semibold text-black break-words">
                {title}
              </h2>
            )}

            {subtitle && <p className="text-sm text-black">{subtitle}</p>}
          </div>

          {icon && <div className="shrink-0">{icon}</div>}
        </div>
      )}

      <div className="text-gray-700">{children}</div>

      {footer && <div className="mt-4 border-t pt-3">{footer}</div>}
    </div>
  );
};

export default Card;
