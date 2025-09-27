import CommonConstants from "@/constants/commanConstants";
import Cookies from 'js-cookie';

export function deleteTicket() {
    Cookies.remove(CommonConstants.TICKET_KEY);

  // also ensure path root removal
  Cookies.remove(CommonConstants.TICKET_KEY, { path: "/" });
}

export function setTicket(ticket: string = '') {
  if (ticket) {
    // save in cookie so middleware can read
    Cookies.set(CommonConstants.TICKET_KEY, ticket, {
      expires: 9 / (24 * 60), // 9 minutes in days (js-cookie expects days)
      secure: true,
      sameSite: "strict",
    });
  } else {
    deleteTicket();
  }
}

export function getTicket(): string | null {
  return Cookies.get(CommonConstants.TICKET_KEY) || null;
}