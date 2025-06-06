export interface ComplaintData {
	searched_plate: string;
	search_successful: boolean;
	crime_report_number: string | null;
	lugar: string | null;
	fecha: string | null;
	delito: string | null;
	error_message: string | null;
}

export interface ComplaintResponse {
	location: string | null;
	date: string | null;
	offense: string | null;
}
