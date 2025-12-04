import { TickCircle, CloseCircle } from "iconsax-reactjs";

interface CustomBadgeProps {
  is_active?: boolean
  label?: string
}

export function CustomBadge({
  is_active = true,
  label = "Actif",
}: CustomBadgeProps) {
    return(
        <div className={`${is_active ? "default" : "secondary"} px-2 py-0.5 w-fit  rounded-lg bg-green-100 border-green-500 border border-dashed text-green-500 text-xs`}>
                {is_active ? (
                  <span className="flex items-center gap-1">
                    <TickCircle size={14} variant="Bulk" color="currentColor" />
                    {label}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <CloseCircle size={14} variant="Bulk" color="currentColor" />
                    {label}
                  </span>
                )}
        </div>
    );
}

export default CustomBadge
