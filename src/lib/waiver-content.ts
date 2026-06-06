// Exact legal text for the two charter waivers. Pure module (no React/Node) —
// shared by the waiver page and the server PDF generator so the signed document
// matches what the signer agreed to.
//
// - BOOKER_WAIVER  (DJ YOUSSEF LLC): signed by the person booking, at checkout.
//                  Initial-each-section + minor/guardian block.
// - GUEST_WAIVER   (G-NOMADS LLC): signed by each guest at check-in.
//
// Bracketed template placeholders from the source PDFs are resolved to their
// intended values (Florida / Miami-Dade County / the operating entity). Obvious
// OCR typos (PRINICIPALS, IDEMNIFY) are corrected; legal wording is preserved.

export type WaiverDocType = "booker" | "guest";

export interface WaiverSection {
  id: string;
  heading?: string;
  body: string;
  requiresInitials?: boolean;
}

export interface WaiverDoc {
  type: WaiverDocType;
  entity: string;
  code?: string;
  title: string;
  intro: string;
  sections: WaiverSection[];
}

export const BOOKER_WAIVER: WaiverDoc = {
  type: "booker",
  entity: "DJ YOUSSEF LLC",
  code: "CSR/WAV/23-1",
  title:
    "CONTRACTUAL ASSUMPTION ACKNOWLEDGEMENT OF RISKS AND LIABILITY WAIVER AND RELEASE AGREEMENT",
  intro:
    "IN CONSIDERATION of being permitted to participate in the charter/rental provided by DJ YOUSSEF LLC for myself and/or any minor children for whom I am the legal parent/guardian or otherwise responsible, and for my/our heirs, personal representatives, or assigns:",
  sections: [
    {
      id: "acknowledgement-of-risks",
      heading: "ACKNOWLEDGEMENT OF RISKS",
      requiresInitials: true,
      body: "I fully acknowledge that some, but not all of the risks of participating in the charter in which I am about to engage may include (1) wind shear, inclement weather, lightning, variances and extremes of wind, weather and temperature; (2) any sense of balance, physical condition, ability to operate equipment, swim and/or follow directions; (3) collision, capsizing, sinking or other hazard which result in wetness, injury, exposure to the elements, hypothermia, impact of the body upon the water, injection of water into my body orifices, and/or drowning; (4) the presence of and/or injury, illness or death resulting from insects, animals and marine life forms; (5) equipment failure, operator error, transportation accidents; (6) heat or sun related injuries or illness, including sunburn, sunstroke or dehydration; (7) fatigue, chill, and/or dizziness which may diminish my/our reaction time and increase the risk of an accident; (8) slippery decks and/or steps when wet; (9) and any other activities incidental to the charter.",
    },
    {
      id: "instructions-training",
      requiresInitials: true,
      body: "I specifically acknowledge that I have been given instructions/training in the safe use of the type of equipment used during this charter to my complete satisfaction, I understand them fully and I am physically/mentally able to participate in the charter which I am about to engage.",
    },
    {
      id: "medical",
      requiresInitials: true,
      body: "I understand that past or present medical conditions may be contraindicative to my participation in the charter/rental. I affirm that I am not currently suffering from a cold or congestion or have an ear infection. I affirm that I do not have any infectious disease or illness (e.g., COVID or similar variants). I affirm that I do not have a history of seizures, dizziness, or fainting, nor a history of heart conditions (e.g., cardiovascular disease, angina, heart attack). I further affirm that I do not have a history of respiratory problems (e.g., emphysema or tuberculosis). I affirm that I am not currently suffering from back, spine and/or neck injuries. I affirm that I am not currently taking medication that carries a warning about any impairment of my physical or mental abilities.",
    },
    {
      id: "assumption-of-risk",
      heading: "CONTRACTUAL/EXPRESS ASSUMPTION OF RISK AND RESPONSIBILITY",
      requiresInitials: true,
      body: "I fully agree to assume all responsibility for all the risks of the DJ YOUSSEF LLC charter to which I am about to engage, whether identified above or not (I FULLY UNDERSTAND THAT I UNDERTAKE EVEN THOSE RISKS ARISING OUT OF THE NEGLIGENCE OF THE RELEASEES NAMED BELOW). My/Our participation in the charter is completely voluntary. I assume full responsibility for myself and any of my minor children for whom I am responsible. This responsibility that I assume on my behalf and that of my minor children, or those children for whom I am legally responsible, extends to any bodily injury, accidents, illnesses, paralysis, death, loss of personal property and expenses thereof as a result of any accident which may occur while we participate in the activity. I COMPLETELY UNDERSTAND AND AGREE TO ACCEPT ALL RESPONSIBILITY ON BEHALF OF MYSELF AND MY MINOR CHILDREN, OR THOSE CHILDREN FOR WHOM I AM LEGALLY RESPONSIBLE, EVEN IF THESE INJURIES, DEATH, OR LOSS OF PERSONAL PROPERTY ARE CAUSED IN WHOLE OR IN PART BY THE NEGLIGENCE OF THE RELEASEES NAMED BELOW.",
    },
    {
      id: "governing-law",
      body: "This Agreement shall be governed by the laws of Florida. Any legal action relating to or arising out of this agreement against or with respect to the assured shall be commenced exclusively in Florida. Any legal action relating to or arising out of this Agreement against or with respect to any of its DJ YOUSSEF LLC affiliated or related companies shall be commenced exclusively in the Circuit Court in and for Miami-Dade County, Florida. I agree that I will reimburse in full any attorney fees incurred by the assured or their insurers to defend any legal action under this agreement.",
    },
    {
      id: "release",
      requiresInitials: true,
      body: "I HEREBY RELEASE DJ YOUSSEF LLC, THEIR AFFILIATED AND RELATED COMPANIES, THEIR PRINCIPALS, DIRECTORS, OFFICERS, AGENTS, EMPLOYEES, AND VOLUNTEERS, THEIR INSURERS, AND EACH AND EVERY LANDOWNER, MUNICIPAL AND/OR GOVERNMENTAL AGENCY UPON WHOSE PROPERTY AND ACTIVITY IS CONDUCTED, AS WELL AS THEIR INSURERS, IF ANY, EACH AND EVERY CRUISELINE OR COMPANY WHO FACILITATED PARTICIPATION AND/OR PURCHASE OF TICKETS, OR FROM ANY AND ALL LIABILITY OF ANY NATURE FOR ANY AND ALL INJURY, PROPERTY LOSS OR DAMAGE (INCLUDING DEATH) TO ME OR MY MINOR CHILDREN AS WELL AS OTHER PERSONS AS A RESULT OF MY/OUR PARTICIPATION IN THE ACTIVITY, EVEN IF CAUSED BY MY NEGLIGENCE OR BY THE NEGLIGENCE OF ANY OF THE RELEASEES NAMED ABOVE, OR ANY OTHER PERSON (INCLUDING MYSELF).",
    },
    {
      id: "final-acknowledgement",
      requiresInitials: true,
      body: "I have read this assumption and acknowledgement of risks and release of liability agreement. I understand fully that it is contractual in nature and binding upon me personally. I further understand that by signing this document I am waiving valuable legal rights including any and all rights I may have against the owner, the renter/charterer, the operator named above, or their employees, agents, servants or assigns. I FULLY AGREE IN CONSIDERATION FOR BEING ALLOWED TO PARTICIPATE IN THE CHARTER TO HOLD HARMLESS AND INDEMNIFY THE OWNER, THE OPERATOR NAMED ABOVE OR THEIR EMPLOYEES, AGENTS, SERVANTS OR ASSIGNS FOR ANY INJURY WHICH MAY BEFALL ME, MY MINOR CHILDREN OR THOSE CHILDREN FOR WHOM I AM LEGALLY RESPONSIBLE (INCLUDING DEATH).",
    },
  ],
};

export const GUEST_WAIVER: WaiverDoc = {
  type: "guest",
  entity: "G-NOMADS LLC",
  title:
    "CONTRACTUAL ASSUMPTION ACKNOWLEDGEMENT OF RISKS AND LIABILITY WAIVER AND RELEASE AGREEMENT",
  intro:
    "IN CONSIDERATION of being permitted to participate in the charter provided by G-NOMADS LLC for myself and/or any minor children for whom I am the legal parent/guardian or otherwise responsible, and for my/our heirs, personal representatives or assigns:",
  sections: [
    {
      id: "acknowledgement-of-risks",
      heading: "ACKNOWLEDGEMENT OF RISKS",
      body: "I fully acknowledge that some, but not all of the risks of participating in the charter in which I am about to engage may include (1) wind shear, inclement weather, lightning, variances and extremes of wind, weather and temperature; (2) any sense of balance, physical condition, ability to operate equipment, swim and/or follow directions; (3) collision, capsizing, sinking or other hazard which result in wetness, injury, exposure to the elements, hypothermia, impact of the body upon the water, injection of water into my body orifices, and/or drowning; (4) the presence of insects and marine life forms; (5) equipment failure, operator error, transportation accidents; (6) heat or sun related injuries or illness, including sunburn, sunstroke or dehydration; (7) fatigue, chill, and/or dizziness which may diminish my/our reaction time and increase the risk of an accident; (8) slippery decks when wet; (9) and any other activities incidental to the charter. I specifically acknowledge I have been given instructions/training in the safe use of the type of equipment used during this charter to my complete satisfaction, and I am physically/mentally able to participate in the charter which I am about to engage.",
    },
    {
      id: "assumption-of-risk",
      heading: "CONTRACTUAL/EXPRESS ASSUMPTION OF RISK AND RESPONSIBILITY",
      body: "I fully agree to assume all responsibility for all the risks of the charter to which I am about to engage, whether identified above or not (I FULLY UNDERSTAND THAT I UNDERTAKE EVEN THOSE RISKS ARISING OUT OF THE NEGLIGENCE OF THE RELEASEES NAMED BELOW). My/Our participation in the charter is completely voluntary. I assume full responsibility for myself and any of my minor children for whom I am responsible. This responsibility that I assume on my behalf and that of my minor children, or those children for whom I am legally responsible, extends to any bodily injury, accidents, illnesses, paralysis, death, loss of personal property and expenses thereof as a result of any accident which may occur while we participate in the activity. I COMPLETELY UNDERSTAND AND AGREE TO ACCEPT ALL RESPONSIBILITY ON BEHALF OF MYSELF AND MY MINOR CHILDREN, OR THOSE CHILDREN FOR WHOM I AM LEGALLY RESPONSIBLE, EVEN IF THESE INJURIES, DEATH, OR LOSS OF PERSONAL PROPERTY ARE CAUSED IN WHOLE OR IN PART BY THE NEGLIGENCE OF THE RELEASEES NAMED BELOW.",
    },
    {
      id: "release",
      body: "I HEREBY RELEASE G-NOMADS LLC, THEIR AFFILIATED AND RELATED COMPANIES, THEIR PRINCIPALS, DIRECTORS, OFFICERS, AGENTS, EMPLOYEES, AND VOLUNTEERS, THEIR INSURERS, AND EACH AND EVERY LANDOWNER, MUNICIPAL AND/OR GOVERNMENTAL AGENCY UPON WHOSE PROPERTY AND ACTIVITY IS CONDUCTED, AS WELL AS THEIR INSURERS, IF ANY, FROM ANY AND ALL LIABILITY OF ANY NATURE FOR ANY AND ALL INJURY OR DAMAGE (INCLUDING DEATH) TO ME OR MY MINOR CHILDREN AS WELL AS OTHER PERSONS AS A RESULT OF MY/OUR PARTICIPATION IN THE ACTIVITY, EVEN IF CAUSED BY MY NEGLIGENCE OR BY THE NEGLIGENCE OF ANY OF THE RELEASEES NAMED ABOVE, OR ANY OTHER PERSON (INCLUDING MYSELF).",
    },
    {
      id: "final-acknowledgement",
      body: "I have read this assumption and acknowledgement of risks and release of liability agreement. I understand fully that it is contractual in nature and binding upon me personally. I further understand that by signing this document I am waiving valuable legal rights including any and all rights I may have against the owner, the operator named above, or their employees, agents, servants or assigns. I FULLY AGREE IN CONSIDERATION FOR BEING ALLOWED TO PARTICIPATE IN THE CHARTER TO HOLD HARMLESS AND INDEMNIFY THE OWNER, THE OPERATOR NAMED ABOVE OR THEIR EMPLOYEES, AGENTS, SERVANTS OR ASSIGNS FOR ANY INJURY WHICH MAY BEFALL ME, MY MINOR CHILDREN OR THOSE CHILDREN FOR WHOM I AM LEGALLY RESPONSIBLE (INCLUDING DEATH). By signing this waiver, you acknowledge that you have read and agree to all of the above.",
    },
  ],
};

export function getWaiverDoc(type: WaiverDocType): WaiverDoc {
  return type === "booker" ? BOOKER_WAIVER : GUEST_WAIVER;
}

export function initialSectionIds(doc: WaiverDoc): string[] {
  return doc.sections.filter((s) => s.requiresInitials).map((s) => s.id);
}
