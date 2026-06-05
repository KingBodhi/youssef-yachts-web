// Single source of truth for the waiver legal text. Imported by both the public
// waiver page (display) and the server-side PDF generator so the signed document
// matches exactly what the guest agreed to. Pure module — no React, no Node.
import { BRAND } from "@/lib/constants";

export const WAIVER_TITLE = "Liability Waiver & Release";

export interface WaiverSection {
  id: string;
  title: string;
  content: string;
}

export const waiverSections: WaiverSection[] = [
  {
    id: "assumption-of-risk",
    title: "1. Assumption of Risk",
    content:
      "I acknowledge that participating in yacht charter activities involves inherent risks, including but not limited to: drowning, slipping, falling, sunburn, seasickness, marine life encounters, equipment malfunction, and adverse weather conditions. I voluntarily assume all risks, known and unknown, associated with participating in this charter, including travel to and from the vessel. I understand that conditions on the water can change rapidly and agree to follow all safety instructions given by the captain and crew at all times.",
  },
  {
    id: "release-of-liability",
    title: "2. Release of Liability",
    content: `I, on behalf of myself, my heirs, executors, administrators, and assigns, hereby release, waive, and forever discharge ${BRAND.name}, its owners, operators, employees, agents, captains, and crew members from any and all liability, claims, demands, actions, and causes of action whatsoever arising out of or related to any loss, damage, or injury, including death, that may be sustained by me or any property belonging to me, whether caused by the negligence of the releasees or otherwise, while participating in charter activities.`,
  },
  {
    id: "medical",
    title: "3. Medical Acknowledgment",
    content:
      "I certify that I am in good physical health and have no medical conditions that would prevent my safe participation in yacht charter activities. I understand that it is my responsibility to inform the captain of any medical conditions, disabilities, allergies, or medications that may affect my participation or require emergency attention. I authorize emergency medical treatment at my own expense if necessary. I understand that medical facilities may not be immediately accessible while on the water.",
  },
  {
    id: "alcohol",
    title: "4. Alcohol & Substance Policy",
    content: `I understand that the consumption of alcoholic beverages on the vessel is permitted for guests 21 years of age and older. I acknowledge that excessive alcohol consumption increases the risk of injury and may impair judgment. I agree not to consume illegal substances aboard the vessel. I understand that the captain reserves the right to refuse service, limit alcohol consumption, or terminate the charter if any guest's behavior, due to intoxication or otherwise, poses a safety risk to themselves, other guests, or the crew. No refund will be issued in such cases.`,
  },
  {
    id: "property-damage",
    title: "5. Property Damage",
    content: `I agree to be held financially responsible for any damage to the vessel, its equipment, furnishings, or any property of ${BRAND.name} caused by my willful misconduct, negligence, or failure to follow the captain's instructions. This includes but is not limited to: damage to upholstery, electronics, water toys, hull, and engine components. I agree to report any damage immediately to the captain. A damage assessment will be conducted at the conclusion of the charter, and repair or replacement costs will be billed accordingly.`,
  },
  {
    id: "emergency",
    title: "6. Emergency Medical Authorization",
    content:
      "In the event of a medical emergency, I authorize the captain and crew to administer basic first aid and to contact emergency medical services on my behalf. I understand and agree that any medical expenses incurred as a result of an emergency during the charter are my sole financial responsibility. I consent to being transported to the nearest medical facility if deemed necessary by the captain or emergency responders. I release the captain and crew from any liability related to emergency medical decisions made in good faith.",
  },
  {
    id: "photo-video",
    title: "7. Photo & Video Release",
    content: `I grant ${BRAND.name}, its employees, and its affiliates the irrevocable right to use any photographs, video recordings, or other media taken during my charter for promotional, marketing, advertising, and editorial purposes across all media platforms, including but not limited to: website, social media, print, and digital advertising. I waive any right to compensation, inspection, or approval of the finished materials. I understand I may request to opt out of this clause by notifying the captain in writing prior to departure.`,
  },
  {
    id: "governing-law",
    title: "8. Governing Law & Jurisdiction",
    content:
      "This waiver and release shall be governed by and construed in accordance with the laws of the State of Florida and applicable federal maritime law. Any disputes arising from this agreement or the charter activities shall be resolved exclusively in the state or federal courts located in Miami-Dade County, Florida. If any provision of this waiver is found to be unenforceable, the remaining provisions shall remain in full force and effect. This waiver constitutes the entire agreement between the parties regarding the subject matter herein.",
  },
];

export const WAIVER_AGREEMENT_STATEMENT =
  "I have read, understood, and agree to all terms above. By typing my full legal name below, I am providing my electronic signature, which constitutes a legal and binding signature under the U.S. ESIGN Act.";
