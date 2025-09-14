import { format } from "date-fns";
import { id } from "date-fns/locale";

export const formattedDate = (date) => {
    if (!date) return '-';

    try {
        return format(new Date(date), 'dd MMMM yyyy', { locale: id });
    } catch (error) {
        console.error('Error formatting date:', error);
        return date?.toString() || '-';
    }
}