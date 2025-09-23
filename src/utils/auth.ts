import CommonConstants from "@/constants/commanConstants";

export function getTicket() {
    return typeof window !== 'undefined'
        ? sessionStorage.getItem(CommonConstants.TICKET_KEY)
        : null;
}

export function deleteTicket() {
    sessionStorage.removeItem(CommonConstants.TICKET_KEY);
}

export function hasTicket(ticket: string) {
    return (
        ticket &&
        ticket !== undefined &&
        ticket !== null &&
        ticket !== '' &&
        ticket !== 'false'
    );
}

export function setTicket(ticket: string = '') {
    if (hasTicket(ticket)) {
        sessionStorage.setItem(CommonConstants.TICKET_KEY, ticket);
    } else {
        sessionStorage.setItem(
            CommonConstants.TICKET_KEY,
            ticket,
        );
    }
}