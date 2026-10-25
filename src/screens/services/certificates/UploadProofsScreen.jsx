import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { useSelector } from "react-redux";

export const getDocumentSlotsForService = (
  serviceId = "",
  serviceTitle = "",
  category = "",
  customDocs = null
) => {
  if (Array.isArray(customDocs) && customDocs.length > 0) {
    return customDocs.map((doc, idx) => {
      const docName = typeof doc === "string" ? doc : doc.name || `Document ${idx + 1}`;
      const cleanKey = docName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      const isRequired = typeof doc === "object" && doc.mandatory ? doc.mandatory.toLowerCase() === "required" : true;
      return {
        key: cleanKey || `doc_${idx}`,
        label: docName,
        placeholder: doc.allowedFormats
          ? `${doc.allowedFormats} (Max ${doc.maxSize || "2MB"})`
          : "PDF, JPEG (Max 2MB)",
        defaultFileName: `${cleanKey || "document"}.pdf`,
        icon: "document-text-outline",
        required: isRequired,
      };
    });
  }

  const sId = (serviceId || "").toLowerCase();
  const sTitle = (serviceTitle || "").toLowerCase();
  const sCat = (category || "").toLowerCase();

  // 1. Aadhaar Address Update
  if (
    sId.includes("addr") ||
    sTitle.includes("address") ||
    (sCat.includes("aadhaar") && sTitle.includes("address"))
  ) {
    return [
      {
        key: "proofOfAddress",
        label: "Proof of Address (POA)",
        placeholder: "Electricity/Water Bill, Rent Deed, Bank Passbook",
        defaultFileName: "address_proof_document.pdf",
        icon: "home-outline",
      },
      {
        key: "aadhaarCard",
        label: "Current Aadhaar Card Copy",
        placeholder: "Front & Back copy (PDF, JPEG Max 2MB)",
        defaultFileName: "current_aadhaar_card.pdf",
        icon: "card-outline",
      },
      {
        key: "passportPhoto",
        label: "Passport Size Photograph",
        placeholder: "Recent colored passport photo (Max 2MB)",
        defaultFileName: "applicant_passport_photo.jpeg",
        icon: "person-outline",
      },
    ];
  }

  // 2. Aadhaar Mobile Update
  if (
    sId.includes("mob") ||
    sTitle.includes("mobile") ||
    sTitle.includes("phone")
  ) {
    return [
      {
        key: "aadhaarCard",
        label: "Aadhaar Card Copy",
        placeholder: "Front & Back copy (PDF, JPEG Max 2MB)",
        defaultFileName: "aadhaar_card_copy.pdf",
        icon: "card-outline",
      },
      {
        key: "mobileDeclaration",
        label: "Mobile Verification Self-Declaration",
        placeholder: "Signed verification form (PDF, JPEG Max 2MB)",
        defaultFileName: "mobile_update_declaration.pdf",
        icon: "document-text-outline",
      },
    ];
  }

  // 3. Aadhaar Name Change / Update
  if (
    sId.includes("name") ||
    sTitle.includes("name change") ||
    sTitle.includes("update name")
  ) {
    return [
      {
        key: "proofOfIdentity",
        label: "Proof of Identity (POI)",
        placeholder: "PAN Card, Passport, Driving License, Voter ID",
        defaultFileName: "identity_proof_poi.pdf",
        icon: "id-card-outline",
      },
      {
        key: "aadhaarCard",
        label: "Current Aadhaar Card Copy",
        placeholder: "Front & Back copy (PDF, JPEG Max 2MB)",
        defaultFileName: "current_aadhaar_card.pdf",
        icon: "card-outline",
      },
      {
        key: "nameChangeProof",
        label: "Gazette Notification / Marriage Certificate",
        placeholder: "Legal name change document (Max 2MB)",
        defaultFileName: "gazette_name_change_proof.pdf",
        icon: "document-text-outline",
      },
    ];
  }

  // 4. Aadhaar Date of Birth Correction / Verification
  if (
    sId.includes("dob") ||
    (sTitle.includes("birth") && sCat.includes("aadhaar")) ||
    sTitle.includes("verify aadhaar")
  ) {
    return [
      {
        key: "dobProof",
        label: "Proof of Date of Birth (DOB)",
        placeholder: "Birth Certificate, 10th Marksheet, Passport",
        defaultFileName: "date_of_birth_proof.pdf",
        icon: "calendar-outline",
      },
      {
        key: "aadhaarCard",
        label: "Current Aadhaar Card Copy",
        placeholder: "Front & Back copy (PDF, JPEG Max 2MB)",
        defaultFileName: "current_aadhaar_card.pdf",
        icon: "card-outline",
      },
    ];
  }

  // 5. Download e-Aadhaar / Check Status / Link Bank / Enrollment
  if (
    sCat.includes("aadhaar") ||
    sId.includes("aadhaar") ||
    sTitle.includes("aadhaar")
  ) {
    return [
      {
        key: "aadhaarOrEnrollment",
        label: "Aadhaar Card or Enrollment Slip (EID)",
        placeholder: "Aadhaar number or 28-digit EID slip (Max 2MB)",
        defaultFileName: "aadhaar_enrollment_slip.pdf",
        icon: "document-text-outline",
      },
      {
        key: "identityProof",
        label: "Registered ID Proof",
        placeholder: "Voter ID / PAN / Driving License (Max 2MB)",
        defaultFileName: "registered_id_proof.pdf",
        icon: "card-outline",
      },
    ];
  }

  // 6. Apply New PAN (Form 49A)
  if (
    sId.includes("new-49a") ||
    sId.includes("apply-new-pan") ||
    sTitle.includes("new pan") ||
    sTitle.includes("form 49a")
  ) {
    return [
      {
        key: "proofOfIdentity",
        label: "Proof of Identity (POI)",
        placeholder: "Aadhaar Card, Voter ID, Driving License",
        defaultFileName: "pan_identity_proof.pdf",
        icon: "id-card-outline",
      },
      {
        key: "proofOfAddress",
        label: "Proof of Address (POA)",
        placeholder: "Aadhaar Card, Utility Bill, Bank Passbook",
        defaultFileName: "pan_address_proof.pdf",
        icon: "home-outline",
      },
      {
        key: "proofOfDob",
        label: "Proof of Date of Birth (DOB)",
        placeholder: "Birth Certificate, 10th Marksheet, Aadhaar",
        defaultFileName: "pan_dob_proof.pdf",
        icon: "calendar-outline",
      },
      {
        key: "passportPhoto",
        label: "Passport Size Photograph",
        placeholder: "Recent white background photo (Max 2MB)",
        defaultFileName: "applicant_passport_photo.jpeg",
        icon: "person-outline",
      },
      {
        key: "specimenSignature",
        label: "Specimen Signature / Thumb Impression",
        placeholder: "Signed on plain white paper (Max 2MB)",
        defaultFileName: "specimen_signature.jpeg",
        icon: "create-outline",
      },
    ];
  }

  // 7. PAN Correction / Re-print
  if (
    sId.includes("reprint") ||
    sId.includes("correction") ||
    sTitle.includes("correction") ||
    sTitle.includes("reprint")
  ) {
    return [
      {
        key: "existingPan",
        label: "Existing PAN Card Copy",
        placeholder: "Front copy or PAN Allotment Letter",
        defaultFileName: "existing_pan_card_copy.pdf",
        icon: "card-outline",
      },
      {
        key: "proofOfIdentity",
        label: "Proof of Identity (POI)",
        placeholder: "Aadhaar Card, Voter ID, Passport (Max 2MB)",
        defaultFileName: "identity_proof_doc.pdf",
        icon: "id-card-outline",
      },
      {
        key: "correctionProof",
        label: "Supporting Proof for Correction",
        placeholder: "Gazette, 10th Marksheet, Marriage Cert for change",
        defaultFileName: "correction_supporting_proof.pdf",
        icon: "document-text-outline",
      },
      {
        key: "specimenSignature",
        label: "Applicant Specimen Signature",
        placeholder: "Updated signature copy (Max 2MB)",
        defaultFileName: "updated_signature.jpeg",
        icon: "create-outline",
      },
    ];
  }

  // 8. Link Aadhaar with PAN / e-PAN Download
  if (
    sCat.includes("pan") ||
    sId.includes("pan") ||
    sTitle.includes("pan")
  ) {
    return [
      {
        key: "panCard",
        label: "PAN Card Copy",
        placeholder: "Front copy showing PAN number",
        defaultFileName: "pan_card_copy.pdf",
        icon: "card-outline",
      },
      {
        key: "aadhaarCard",
        label: "Aadhaar Card Copy",
        placeholder: "Front & Back copy (PDF, JPEG Max 2MB)",
        defaultFileName: "aadhaar_card_copy.pdf",
        icon: "card-outline",
      },
    ];
  }

  // 9. Birth Certificate
  if (sId.includes("birth") || sTitle.includes("birth")) {
    return [
      {
        key: "hospitalSlip",
        label: "Hospital Discharge Summary / Birth Slip",
        placeholder: "Official institutional birth certificate (Max 2MB)",
        defaultFileName: "hospital_discharge_slip.pdf",
        icon: "document-text-outline",
      },
      {
        key: "motherAadhaar",
        label: "Mother's Aadhaar Card",
        placeholder: "Front & Back copy (PDF, JPEG Max 2MB)",
        defaultFileName: "mother_aadhaar_card.jpeg",
        icon: "card-outline",
      },
      {
        key: "fatherAadhaar",
        label: "Father's Aadhaar Card",
        placeholder: "Front & Back copy (PDF, JPEG Max 2MB)",
        defaultFileName: "father_aadhaar_card.jpeg",
        icon: "card-outline",
      },
      {
        key: "addressProof",
        label: "Parents' Address Proof",
        placeholder: "Electricity bill, Rent deed, Ration card",
        defaultFileName: "parents_address_proof.pdf",
        icon: "home-outline",
      },
    ];
  }

  // 10. Death Certificate
  if (sId.includes("death") || sTitle.includes("death")) {
    return [
      {
        key: "hospitalDeathSlip",
        label: "Hospital Death Summary / Medical Certificate",
        placeholder: "Doctor / Hospital death declaration (Max 2MB)",
        defaultFileName: "hospital_death_report.pdf",
        icon: "document-text-outline",
      },
      {
        key: "deceasedId",
        label: "Deceased Person's Aadhaar / ID Proof",
        placeholder: "Aadhaar / Voter ID of deceased person",
        defaultFileName: "deceased_aadhaar_id.pdf",
        icon: "card-outline",
      },
      {
        key: "applicantId",
        label: "Applicant / Legal Heir ID Proof",
        placeholder: "Aadhaar Card / Voter ID of applicant",
        defaultFileName: "applicant_legal_heir_id.pdf",
        icon: "person-outline",
      },
      {
        key: "cremationReceipt",
        label: "Cremation / Burial Ground Receipt",
        placeholder: "Official cremation or cemetery receipt (Max 2MB)",
        defaultFileName: "cremation_burial_receipt.pdf",
        icon: "receipt-outline",
      },
    ];
  }

  // 11. Income Certificate
  if (
    sId.includes("income") ||
    sTitle.includes("income") ||
    sId.includes("inc-cert")
  ) {
    return [
      {
        key: "incomeProof",
        label: "Income Proof (Salary Slip / Form 16 / ITR / Patwari Report)",
        placeholder: "Latest salary slip, ITR or Revenue report",
        defaultFileName: "income_salary_proof.pdf",
        icon: "cash-outline",
      },
      {
        key: "aadhaarCard",
        label: "Applicant's Aadhaar Card",
        placeholder: "Front & Back copy (PDF, JPEG Max 2MB)",
        defaultFileName: "applicant_aadhaar_card.pdf",
        icon: "card-outline",
      },
      {
        key: "bankStatement",
        label: "Bank Statement (Last 6 Months)",
        placeholder: "Official bank passbook / statement (Max 2MB)",
        defaultFileName: "bank_statement_6months.pdf",
        icon: "business-outline",
      },
      {
        key: "addressProof",
        label: "Ration Card / Electricity Bill (Address Proof)",
        placeholder: "Water / Electricity bill, Rent deed, Ration card",
        defaultFileName: "utility_address_bill.pdf",
        icon: "home-outline",
      },
      {
        key: "selfDeclaration",
        label: "Self Declaration Affidavit on Stamp Paper",
        placeholder: "Notarized income affidavit form (Max 2MB)",
        defaultFileName: "income_self_affidavit.pdf",
        icon: "document-text-outline",
      },
    ];
  }

  // 12. Caste / Tribe Certificate
  if (
    sId.includes("caste") ||
    sTitle.includes("caste") ||
    sTitle.includes("tribe") ||
    sId.includes("cast-cert")
  ) {
    return [
      {
        key: "fatherCasteProof",
        label: "Father / Blood Relative Caste Certificate",
        placeholder: "Existing family caste certificate copy",
        defaultFileName: "relative_caste_certificate.pdf",
        icon: "ribbon-outline",
      },
      {
        key: "applicantAadhaar",
        label: "Applicant's Aadhaar Card",
        placeholder: "Front & Back copy (PDF, JPEG Max 2MB)",
        defaultFileName: "applicant_aadhaar_card.pdf",
        icon: "card-outline",
      },
      {
        key: "schoolTc",
        label: "School Leaving Certificate / 10th TC",
        placeholder: "Showing applicant's caste record (Max 2MB)",
        defaultFileName: "school_leaving_tc.pdf",
        icon: "school-outline",
      },
      {
        key: "residenceProof",
        label: "Proof of Residence (10+ Years)",
        placeholder: "Ration Card, Domicile or Land Revenue record",
        defaultFileName: "residence_proof_document.pdf",
        icon: "home-outline",
      },
      {
        key: "casteAffidavit",
        label: "Self Declaration / Notarized Affidavit",
        placeholder: "Declaration of caste & lineage form",
        defaultFileName: "caste_self_declaration.pdf",
        icon: "document-text-outline",
      },
    ];
  }

  // 13. Domicile / Residence Certificate
  if (
    sId.includes("domicile") ||
    sTitle.includes("domicile") ||
    sId.includes("residence") ||
    sTitle.includes("residence")
  ) {
    return [
      {
        key: "residenceProof",
        label: "Proof of Continuous Residence (10+ Years)",
        placeholder: "Electricity bills (last 3-5 yrs) / Land registry",
        defaultFileName: "continuous_residence_proof.pdf",
        icon: "home-outline",
      },
      {
        key: "applicantAadhaar",
        label: "Applicant's Aadhaar Card",
        placeholder: "Front & Back copy (PDF, JPEG Max 2MB)",
        defaultFileName: "applicant_aadhaar_card.pdf",
        icon: "card-outline",
      },
      {
        key: "educationRecord",
        label: "Education Certificate / School TC",
        placeholder: "School records showing schooling in state",
        defaultFileName: "school_education_record.pdf",
        icon: "school-outline",
      },
      {
        key: "passportPhoto",
        label: "Passport Size Photograph",
        placeholder: "Recent passport size photo (Max 2MB)",
        defaultFileName: "applicant_passport_photo.jpeg",
        icon: "person-outline",
      },
      {
        key: "domicileDeclaration",
        label: "Self Declaration & Affidavit",
        placeholder: "Signed domicile declaration form",
        defaultFileName: "domicile_declaration_affidavit.pdf",
        icon: "document-text-outline",
      },
    ];
  }

  // 14. Marriage Certificate
  if (sId.includes("marriage") || sTitle.includes("marriage")) {
    return [
      {
        key: "marriageProof",
        label: "Marriage Invitation Card / Temple Receipt",
        placeholder: "Wedding card, Temple / Church certificate",
        defaultFileName: "marriage_invitation_proof.pdf",
        icon: "heart-outline",
      },
      {
        key: "husbandId",
        label: "Husband's Aadhaar Card & ID Proof",
        placeholder: "Aadhaar Card / Voter ID (Max 2MB)",
        defaultFileName: "husband_aadhaar_id.pdf",
        icon: "card-outline",
      },
      {
        key: "wifeId",
        label: "Wife's Aadhaar Card & ID Proof",
        placeholder: "Aadhaar Card / Voter ID (Max 2MB)",
        defaultFileName: "wife_aadhaar_id.pdf",
        icon: "card-outline",
      },
      {
        key: "jointPhoto",
        label: "Joint Marriage Photograph",
        placeholder: "Photo of couple at wedding ceremony",
        defaultFileName: "joint_marriage_photograph.jpeg",
        icon: "image-outline",
      },
      {
        key: "witnessIds",
        label: "Witness ID Proofs (2 Witnesses)",
        placeholder: "Aadhaar / Voter IDs of both witnesses",
        defaultFileName: "witness_id_proofs.pdf",
        icon: "people-outline",
      },
    ];
  }

  // 15. Character Certificate
  if (sId.includes("character") || sTitle.includes("character")) {
    return [
      {
        key: "applicantAadhaar",
        label: "Applicant's Aadhaar Card",
        placeholder: "Front & Back copy (PDF, JPEG Max 2MB)",
        defaultFileName: "applicant_aadhaar_card.pdf",
        icon: "card-outline",
      },
      {
        key: "wardRecommendation",
        label: "Local Ward Counselor / Gram Pradhan Letter",
        placeholder: "Recommendation letter on official letterhead",
        defaultFileName: "ward_counselor_letter.pdf",
        icon: "document-text-outline",
      },
      {
        key: "educationCert",
        label: "Educational / Institutional Certificate",
        placeholder: "Last attended school / college certificate",
        defaultFileName: "institution_certificate.pdf",
        icon: "school-outline",
      },
      {
        key: "passportPhoto",
        label: "Passport Size Photograph",
        placeholder: "Recent passport photo (Max 2MB)",
        defaultFileName: "applicant_passport_photo.jpeg",
        icon: "person-outline",
      },
    ];
  }

  // 16. EWS / Non-Creamy Layer (NCL)
  if (
    sId.includes("ews") ||
    sTitle.includes("ews") ||
    sId.includes("ncl") ||
    sTitle.includes("non-creamy")
  ) {
    return [
      {
        key: "familyIncomeProof",
        label: "Family Income Proof (ITR / Form 16 / Salary)",
        placeholder: "All earning family members' income proof",
        defaultFileName: "family_income_proof.pdf",
        icon: "cash-outline",
      },
      {
        key: "propertyDocuments",
        label: "Land & Property Records (Khatoni / Registry)",
        placeholder: "Agricultural land / residential flat documents",
        defaultFileName: "property_land_records.pdf",
        icon: "business-outline",
      },
      {
        key: "applicantAadhaar",
        label: "Applicant & Parents' Aadhaar Cards",
        placeholder: "Front & back copies of all members",
        defaultFileName: "family_aadhaar_copies.pdf",
        icon: "card-outline",
      },
      {
        key: "ewsAffidavit",
        label: "Notarized EWS Affidavit on Stamp Paper",
        placeholder: "Statutory asset and income declaration",
        defaultFileName: "notarized_ews_affidavit.pdf",
        icon: "document-text-outline",
      },
    ];
  }

  // 17. Passport Services
  if (sId.includes("pass") || sTitle.includes("passport")) {
    return [
      {
        key: "proofOfAddress",
        label: "Proof of Present Address",
        placeholder: "Aadhaar Card, Water/Electricity bill, Bank passbook",
        defaultFileName: "passport_address_proof.pdf",
        icon: "home-outline",
      },
      {
        key: "proofOfDob",
        label: "Proof of Date of Birth (DOB)",
        placeholder: "Birth Certificate or 10th Standard Marksheet",
        defaultFileName: "passport_dob_proof.pdf",
        icon: "calendar-outline",
      },
      {
        key: "proofOfIdentity",
        label: "Proof of Identity (POI)",
        placeholder: "PAN Card, Voter ID, Driving License",
        defaultFileName: "passport_identity_proof.pdf",
        icon: "id-card-outline",
      },
      {
        key: "nonEcrProof",
        label: "Non-ECR Eligible Document",
        placeholder: "10th pass certificate or higher degree certificate",
        defaultFileName: "non_ecr_educational_proof.pdf",
        icon: "school-outline",
      },
    ];
  }

  // 18. Utility / Banking / Insurance
  if (
    sCat.includes("utility") ||
    sCat.includes("finance") ||
    sId.includes("utility") ||
    sTitle.includes("bill") ||
    sTitle.includes("electricity") ||
    sTitle.includes("water") ||
    sTitle.includes("banking") ||
    sTitle.includes("insurance")
  ) {
    return [
      {
        key: "billInvoice",
        label: "Latest Bill / Invoice / Account Statement",
        placeholder: "Consumer account bill or policy statement",
        defaultFileName: "latest_consumer_bill.pdf",
        icon: "receipt-outline",
      },
      {
        key: "consumerId",
        label: "Consumer Aadhaar Card / ID Proof",
        placeholder: "Aadhaar Card / Voter ID (Max 2MB)",
        defaultFileName: "consumer_id_proof.pdf",
        icon: "card-outline",
      },
      {
        key: "bankPassbook",
        label: "Bank Passbook / Payment Proof",
        placeholder: "Bank account details or cancelled cheque",
        defaultFileName: "bank_passbook_copy.pdf",
        icon: "business-outline",
      },
    ];
  }

  // 19. Generic fallback for any other citizen service
  return [
    {
      key: "proofOfIdentity",
      label: "Proof of Identity (POI)",
      placeholder: "Aadhaar Card, PAN Card, Voter ID (Max 2MB)",
      defaultFileName: "identity_proof_document.pdf",
      icon: "id-card-outline",
    },
    {
      key: "proofOfAddress",
      label: "Proof of Address (POA)",
      placeholder: "Electricity bill, Rent deed, Bank passbook",
      defaultFileName: "address_proof_document.pdf",
      icon: "home-outline",
    },
    {
      key: "supportingDocument",
      label: "Supporting Document / Application Form",
      placeholder: "Signed form or relevant certificate (Max 2MB)",
      defaultFileName: "supporting_service_document.pdf",
      icon: "document-text-outline",
    },
  ];
};

const UploadProofsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const serviceTitle = route?.params?.serviceTitle || "Service";
  const serviceId = route?.params?.serviceId || "service";
  const fee = route?.params?.fee || "₹50";
  const category = route?.params?.category || "Services";

  const { catalogue } = useSelector((state) => state.services || {});
  const passedDocs = route?.params?.requiredDocuments || route?.params?.service?.requiredDocuments;

  // Match live service configuration from MongoDB catalogue if available
  const matchedService = useMemo(() => {
    const sorted = [...(catalogue || [])].reverse();
    return sorted.find((c) => {
      const cName = (c.name || c.title || "").toLowerCase();
      const cCode = (c.id || c.serviceId || c.serviceCode || c.code || "").toLowerCase();
      const targetTitle = serviceTitle.toLowerCase();
      const targetId = serviceId.toLowerCase();
      return (
        cName.includes(targetTitle) ||
        targetTitle.includes(cName) ||
        cCode.includes(targetId) ||
        targetId.includes(cCode)
      );
    });
  }, [catalogue, serviceTitle, serviceId]);

  // Dynamically resolve document requirements specific to THIS service
  const documentSlots = useMemo(() => {
    const customDocs =
      passedDocs && passedDocs.length > 0
        ? passedDocs
        : matchedService?.requiredDocuments && matchedService.requiredDocuments.length > 0
        ? matchedService.requiredDocuments
        : null;

    return getDocumentSlotsForService(
      serviceId,
      serviceTitle,
      category,
      customDocs
    );
  }, [serviceId, serviceTitle, category, matchedService, passedDocs]);

  // Dynamically resolve form fields configured in Form Builder for THIS service
  const passedFormFields = route?.params?.formFields || route?.params?.service?.formFields;
  const formFields = useMemo(() => {
    if (Array.isArray(passedFormFields) && passedFormFields.length > 0) {
      return passedFormFields;
    }
    if (
      matchedService?.formFields &&
      Array.isArray(matchedService.formFields) &&
      matchedService.formFields.length > 0
    ) {
      return matchedService.formFields;
    }
    return [];
  }, [passedFormFields, matchedService]);

  // Form field answers state & validation error state
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const validateSingleField = (field, value) => {
    const isRequired = field.required !== false;
    const type = (field.type || "Text Input").toLowerCase();
    const rule = (field.validationRule || "None").toLowerCase();
    const valStr = value !== undefined && value !== null ? String(value).trim() : "";

    if (isRequired && !valStr) {
      return `${field.label || "This field"} is required.`;
    }

    if (!valStr) return null;

    // 1. Email Address Validation
    if (type.includes("email") || rule.includes("email")) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(valStr)) {
        return "Please enter a valid email address (e.g. name@domain.com)";
      }
    }

    // 2. Phone / 10-Digit Mobile Validation
    if (
      type.includes("phone") ||
      type.includes("mobile") ||
      rule.includes("10-digit") ||
      rule.includes("mobile")
    ) {
      if (!/^\d{10}$/.test(valStr)) {
        return "Must be exactly 10 digits";
      }
      if (!/^[6-9]\d{9}$/.test(valStr)) {
        return "Must be a valid 10-digit mobile number starting with 6-9";
      }
    }

    // 3. Number / Numeric Input Validation
    if (type.includes("number") || type.includes("numeric") || rule.includes("number")) {
      if (!/^\d+$/.test(valStr)) {
        return "Only numbers (digits 0-9) are allowed";
      }
      if (rule.includes("10-digit") && valStr.length !== 10) {
        return "Must be a 10-digit number";
      }
      if (rule.includes("6 digit") && valStr.length !== 6) {
        return "Must be a 6-digit PIN code";
      }
    }

    // 4. Text / Alphabetic Only Validation
    if (
      (type.includes("text") && !type.includes("area") && !type.includes("multiline")) ||
      rule.includes("alphabetic") ||
      rule.includes("alpha")
    ) {
      if (!/^[a-zA-Z\s]+$/.test(valStr)) {
        return "Only alphabets / letters are allowed (no numbers or symbols)";
      }
    }

    // 5. Date Validation (DD/MM/YYYY)
    if (type.includes("date") || rule.includes("date")) {
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (!dateRegex.test(valStr)) {
        return "Please enter a valid date in DD/MM/YYYY format";
      }
      const parts = valStr.split("/");
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const y = parseInt(parts[2], 10);
      if (m < 1 || m > 12) return "Invalid month (must be 01-12)";
      if (d < 1 || d > 31) return "Invalid day (must be 01-31)";
      if (y < 1900 || y > 2100) return "Invalid year (1900-2100)";
    }

    // 6. Aadhaar 12-Digit Validation
    if (rule.includes("aadhaar")) {
      if (!/^\d{12}$/.test(valStr)) {
        return "Must be a valid 12-digit Aadhaar number";
      }
    }

    // 7. PAN Card Format Validation
    if (rule.includes("pan")) {
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(valStr)) {
        return "Must be a valid PAN format (e.g. ABCDE1234F)";
      }
    }

    return null;
  };

  const handleFieldChange = (field, rawValue) => {
    const fieldKey = field.id || `field_${field.label}`;
    const type = (field.type || "Text Input").toLowerCase();
    const rule = (field.validationRule || "None").toLowerCase();

    let cleanValue = rawValue;

    if (typeof rawValue === "string") {
      // Alphabetic restriction on Text Input
      if (
        (type.includes("text") && !type.includes("area") && !type.includes("multiline")) ||
        rule.includes("alphabetic") ||
        rule.includes("alpha")
      ) {
        cleanValue = rawValue.replace(/[^a-zA-Z\s]/g, "");
      }
      // Numeric restriction on Number and Phone Inputs
      else if (
        type.includes("number") ||
        type.includes("numeric") ||
        type.includes("phone") ||
        type.includes("mobile") ||
        rule.includes("number") ||
        rule.includes("mobile")
      ) {
        cleanValue = rawValue.replace(/[^0-9]/g, "").slice(0, 10);
      }
      // Date Auto-Mask DD/MM/YYYY
      else if (type.includes("date") || rule.includes("date")) {
        const digits = rawValue.replace(/[^0-9]/g, "").slice(0, 8);
        if (digits.length > 4) {
          cleanValue = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
        } else if (digits.length > 2) {
          cleanValue = `${digits.slice(0, 2)}/${digits.slice(2)}`;
        } else {
          cleanValue = digits;
        }
      }
    }

    setFormValues((prev) => ({
      ...prev,
      [fieldKey]: cleanValue,
    }));

    // Perform live validation check
    const errorMsg = validateSingleField(field, cleanValue);
    setFormErrors((prev) => ({
      ...prev,
      [fieldKey]: errorMsg,
    }));
  };

  const totalFieldsCount = formFields.length;
  const filledFieldsCount = formFields.filter((f, idx) => {
    const key = f.id || `field_${idx}`;
    return Boolean(formValues[key] && String(formValues[key]).trim());
  }).length;

  // Interactive Comprehensive Date Picker State
  const MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const YEARS_LIST = useMemo(
    () => Array.from({ length: 105 }, (_, i) => 2035 - i),
    []
  );

  const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);
  const [activeDateField, setActiveDateField] = useState(null);
  const [pickerDay, setPickerDay] = useState(1);
  const [pickerMonth, setPickerMonth] = useState(1);
  const [pickerYear, setPickerYear] = useState(2000);

  const openDatePickerForField = (field, currentVal) => {
    setActiveDateField(field);
    if (currentVal && typeof currentVal === "string" && currentVal.includes("/")) {
      const parts = currentVal.split("/");
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const y = parseInt(parts[2], 10);
      if (!isNaN(d) && d >= 1 && d <= 31) setPickerDay(d);
      if (!isNaN(m) && m >= 1 && m <= 12) setPickerMonth(m);
      if (!isNaN(y) && y >= 1920 && y <= 2035) setPickerYear(y);
    } else {
      const now = new Date();
      setPickerDay(now.getDate());
      setPickerMonth(now.getMonth() + 1);
      setPickerYear(now.getFullYear() - 20);
    }
    setDatePickerModalVisible(true);
  };

  const handleApplyChosenDate = () => {
    if (activeDateField) {
      const daysInMonth = new Date(pickerYear, pickerMonth, 0).getDate();
      const validDay = Math.min(pickerDay, daysInMonth);
      const dd = String(validDay).padStart(2, "0");
      const mm = String(pickerMonth).padStart(2, "0");
      const yyyy = String(pickerYear);
      handleFieldChange(activeDateField, `${dd}/${mm}/${yyyy}`);
    }
    setDatePickerModalVisible(false);
    setActiveDateField(null);
  };

  // STRICTLY EMPTY INITIAL STATE - User MUST manually upload each document
  const [docs, setDocs] = useState({});

  const [activeSlot, setActiveSlot] = useState(null);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState(null);

  const openPicker = (slot) => {
    setActiveSlot(slot);
    setPickerModalVisible(true);
  };

  const handleDeviceDocumentPick = async () => {
    if (!activeSlot) return;
    const slotKey = activeSlot.key;
    const isFormField = activeSlot.isFormField;
    setPickerModalVisible(false);

    try {
      setUploadingSlot(slotKey);
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png", "image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const uploadedName = file.name || `${slotKey}_doc.pdf`;
        if (isFormField) {
          setFormValues((prev) => ({
            ...prev,
            [slotKey]: uploadedName,
          }));
          setFormErrors((prev) => ({
            ...prev,
            [slotKey]: null,
          }));
        } else {
          setDocs((prev) => ({
            ...prev,
            [slotKey]: uploadedName,
          }));
        }
      }
    } catch (err) {
      console.warn("Device document picker:", err);
    } finally {
      setUploadingSlot(null);
      setActiveSlot(null);
    }
  };

  const handleSimulatedPick = (fileType) => {
    if (!activeSlot) return;
    const slotKey = activeSlot.key;
    const isFormField = activeSlot.isFormField;
    setPickerModalVisible(false);

    const extension = fileType === "pdf" ? ".pdf" : ".jpeg";
    const generatedName =
      (activeSlot.defaultFileName || `${slotKey}_doc.pdf`).replace(
        /\.[^/.]+$/,
        ""
      ) + extension;

    setUploadingSlot(slotKey);
    setTimeout(() => {
      if (isFormField) {
        setFormValues((prev) => ({
          ...prev,
          [slotKey]: generatedName,
        }));
        setFormErrors((prev) => ({
          ...prev,
          [slotKey]: null,
        }));
      } else {
        setDocs((prev) => ({
          ...prev,
          [slotKey]: generatedName,
        }));
      }
      setUploadingSlot(null);
      setActiveSlot(null);
    }, 600);
  };

  const handleRemove = (key) => {
    setDocs((prev) => ({ ...prev, [key]: null }));
  };

  const handleContinue = () => {
    // 1. Validate required documents
    const missingSlots = documentSlots.filter((slot) => slot.required !== false && !docs[slot.key]);

    if (missingSlots.length > 0) {
      const missingLabels = missingSlots
        .map((s) => `• ${s.label}`)
        .join("\n");
      Alert.alert(
        "Upload Required Documents",
        `Please upload all required proofs before proceeding:\n\n${missingLabels}`
      );
      return;
    }

    // 2. Validate all Changes Required form fields
    const errorsMap = {};
    const errorDetails = [];

    formFields.forEach((field, idx) => {
      const fieldKey = field.id || `field_${idx}`;
      const val = formValues[fieldKey];
      const errorMsg = validateSingleField(field, val);
      if (errorMsg) {
        errorsMap[fieldKey] = errorMsg;
        errorDetails.push(`• ${field.label || `Field ${idx + 1}`}: ${errorMsg}`);
      }
    });

    if (errorDetails.length > 0) {
      setFormErrors(errorsMap);
      Alert.alert(
        "Changes Required",
        `Please correct the highlighted fields:\n\n${errorDetails.slice(0, 5).join("\n")}`
      );
      return;
    }

    navigation.navigate("ReviewDetails", {
      serviceId,
      serviceTitle,
      category,
      fee,
      docs,
      formValues,
      formFields,
    });
  };

  const renderFormFieldInput = (field, fieldKey, val) => {
    const type = (field.type || "Text Input").toLowerCase();
    const error = formErrors[fieldKey];
    const hasError = Boolean(error);

    // 1. Text Area / Multi-line
    if (type.includes("area") || type.includes("multiline") || type.includes("address")) {
      return (
        <View>
          <TextInput
            style={[
              styles.customTextInput,
              { minHeight: 72, textAlignVertical: "top" },
              hasError && styles.inputErrorBorder,
            ]}
            placeholder={field.placeholder || `Enter ${field.label || "details"}`}
            placeholderTextColor="#94A3B8"
            value={val}
            onChangeText={(text) => handleFieldChange(field, text)}
            multiline
            numberOfLines={3}
          />
          {hasError && (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={13} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      );
    }

    // 2. Number / Numeric Input (10 Digits or numbers only)
    if (type.includes("number") || type.includes("numeric") || type.includes("amount") || type.includes("pincode")) {
      return (
        <View>
          <TextInput
            style={[styles.customTextInput, hasError && styles.inputErrorBorder]}
            placeholder={field.placeholder || `Enter 10-digit ${field.label || "number"}`}
            placeholderTextColor="#94A3B8"
            value={val}
            onChangeText={(text) => handleFieldChange(field, text)}
            keyboardType="numeric"
            maxLength={10}
          />
          {hasError && (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={13} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      );
    }

    // 3. Email Address
    if (type.includes("email")) {
      return (
        <View>
          <TextInput
            style={[styles.customTextInput, hasError && styles.inputErrorBorder]}
            placeholder={field.placeholder || "example@domain.com"}
            placeholderTextColor="#94A3B8"
            value={val}
            onChangeText={(text) => handleFieldChange(field, text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {hasError && (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={13} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      );
    }

    // 4. Phone / Mobile Field
    if (type.includes("phone") || type.includes("mobile")) {
      return (
        <View>
          <TextInput
            style={[styles.customTextInput, hasError && styles.inputErrorBorder]}
            placeholder={field.placeholder || "Enter 10-digit mobile number"}
            placeholderTextColor="#94A3B8"
            value={val}
            onChangeText={(text) => handleFieldChange(field, text)}
            keyboardType="phone-pad"
            maxLength={10}
          />
          {hasError && (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={13} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      );
    }

    // 5. Date Picker (Interactive DD/MM/YYYY Mask & Calendar button)
    if (type.includes("date")) {
      return (
        <View>
          <View style={[styles.dateInputContainer, hasError && styles.inputErrorBorder]}>
            <TextInput
              style={styles.dateTextInput}
              placeholder={field.placeholder || "DD/MM/YYYY"}
              placeholderTextColor="#94A3B8"
              value={val}
              onChangeText={(text) => handleFieldChange(field, text)}
              keyboardType="numeric"
              maxLength={10}
            />
            <TouchableOpacity
              style={styles.dateCalBtn}
              onPress={() => openDatePickerForField(field, val)}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar" size={19} color="#2563EB" />
            </TouchableOpacity>
          </View>
          {hasError && (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={13} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      );
    }

    // 6. Dropdown / Radio Control
    if (type.includes("dropdown") || type.includes("select") || type.includes("radio")) {
      const options =
        Array.isArray(field.options) && field.options.length > 0
          ? field.options
          : ["Option 1", "Option 2", "Option 3"];

      return (
        <View>
          <View style={styles.optionsWrap}>
            {options.map((opt, oIdx) => {
              const isSelected = val === opt;
              return (
                <TouchableOpacity
                  key={oIdx}
                  onPress={() => handleFieldChange(field, opt)}
                  style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                  activeOpacity={0.75}
                >
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <Text
                    style={[styles.optionPillText, isSelected && styles.optionPillTextSelected]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {hasError && (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={13} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      );
    }

    // 7. Checkbox Option
    if (type.includes("checkbox")) {
      const isChecked = Boolean(val);
      return (
        <View>
          <TouchableOpacity
            onPress={() => handleFieldChange(field, isChecked ? "" : "Yes")}
            style={styles.checkboxRow}
            activeOpacity={0.75}
          >
            <View style={[styles.checkboxBox, isChecked && styles.checkboxBoxSelected]}>
              {isChecked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.checkboxLabel}>
              {field.placeholder || field.label || "I confirm this requirement"}
            </Text>
          </TouchableOpacity>
          {hasError && (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={13} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      );
    }

    // 8. File Upload in Form Builder
    if (type.includes("file") || type.includes("upload")) {
      const uploadedFile = val || docs[fieldKey];
      const isUploading = uploadingSlot === fieldKey;

      return (
        <View>
          {isUploading ? (
            <View style={styles.uploadingBox}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={styles.uploadingText}>Uploading file...</Text>
            </View>
          ) : uploadedFile ? (
            <View style={styles.attachedBox}>
              <Ionicons name="document-text" size={20} color="#2563EB" />
              <Text style={styles.attachedName} numberOfLines={1}>
                {uploadedFile}
              </Text>
              <TouchableOpacity
                onPress={() => handleFieldChange(field, "")}
                activeOpacity={0.7}
                style={styles.trashBtn}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.dashedBox, hasError && styles.inputErrorBorder]}
              onPress={() =>
                openPicker({
                  key: fieldKey,
                  label: field.label || "Document Upload",
                  defaultFileName: `${fieldKey}.pdf`,
                  placeholder: field.placeholder || "PDF, JPEG (Max 2MB)",
                  isFormField: true,
                })
              }
              activeOpacity={0.75}
            >
              <Ionicons name="cloud-upload-outline" size={20} color="#64748B" />
              <Text style={styles.dashedText}>
                {field.placeholder || "Click to upload file"}
              </Text>
            </TouchableOpacity>
          )}
          {hasError && (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={13} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      );
    }

    // Default: Standard Text Input (Alphabetic letters only)
    return (
      <View>
        <TextInput
          style={[styles.customTextInput, hasError && styles.inputErrorBorder]}
          placeholder={field.placeholder || "Enter letters only"}
          placeholderTextColor="#94A3B8"
          value={val}
          onChangeText={(text) => handleFieldChange(field, text)}
        />
        {hasError && (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle" size={13} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    );
  };

  const totalSlotsCount = documentSlots.length;
  const uploadedCount = documentSlots.filter((slot) =>
    Boolean(docs[slot.key])
  ).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      {/* TOP BLUE GRADIENT HEADER */}
      <LinearGradient
        colors={["#1E3A8A", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          { paddingTop: (insets.top || StatusBar.currentHeight || 24) + 14, paddingBottom: 48 },
        ]}
      >
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Upload Proofs</Text>

        <View style={styles.stepTag}>
          <Text style={styles.stepTagText}>Step 2/5</Text>
        </View>
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        {/* Progress Line */}
        <View style={styles.progressLineWrap}>
          <View style={[styles.progressActive, { width: "40%" }]} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 30 },
          ]}
        >
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Required Documents</Text>
            <Text style={styles.countBadge}>
              {uploadedCount}/{totalSlotsCount} Uploaded
            </Text>
          </View>

          {/* DYNAMIC SERVICE-SPECIFIC DOCUMENT UPLOAD SLOTS */}
          {documentSlots.map((slot) => {
            const uploadedName = docs[slot.key];
            const isUploading = uploadingSlot === slot.key;

            return (
              <View key={slot.key} style={styles.docFieldGroup}>
                <Text style={styles.docLabel}>
                  {slot.label} <Text style={styles.requiredStar}>*</Text>
                </Text>

                {isUploading ? (
                  <View style={styles.uploadingBox}>
                    <ActivityIndicator size="small" color="#2563EB" />
                    <Text style={styles.uploadingText}>Uploading document...</Text>
                  </View>
                ) : uploadedName ? (
                  <View style={styles.attachedBox}>
                    <Ionicons
                      name="document-text"
                      size={20}
                      color="#2563EB"
                    />
                    <Text style={styles.attachedName} numberOfLines={1}>
                      {uploadedName}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemove(slot.key)}
                      activeOpacity={0.7}
                      style={styles.trashBtn}
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.dashedBox}
                    onPress={() => openPicker(slot)}
                    activeOpacity={0.75}
                  >
                    <Ionicons
                      name="cloud-upload-outline"
                      size={22}
                      color="#64748B"
                    />
                    <Text style={styles.dashedText}>{slot.placeholder}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          {/* CHANGES REQUIRED / FORM BUILDER INPUTS SECTION */}
          {formFields.length > 0 && (
            <View style={styles.changesSectionWrap}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Changes Required</Text>
                <Text style={styles.countBadge}>
                  {filledFieldsCount}/{totalFieldsCount} Filled
                </Text>
              </View>

              {formFields.map((field, idx) => {
                const fieldKey = field.id || `field_${idx}`;
                const val = formValues[fieldKey] ?? "";
                const isRequired = field.required !== false;

                return (
                  <View key={fieldKey} style={styles.docFieldGroup}>
                    <Text style={styles.docLabel}>
                      {field.label || `Field ${idx + 1}`}{" "}
                      {isRequired && <Text style={styles.requiredStar}>*</Text>}
                    </Text>

                    {renderFormFieldInput(field, fieldKey, val)}
                  </View>
                );
              })}
            </View>
          )}

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Interactive Document Attachment Modal */}
      <Modal
        visible={pickerModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setPickerModalVisible(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Upload {activeSlot?.label}</Text>
            <Text style={styles.modalSubtitle}>
              Select document from your device (PDF, JPEG max 2MB)
            </Text>

            {/* Option 1: Native Device File Picker */}
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleDeviceDocumentPick}
              activeOpacity={0.7}
            >
              <View style={[styles.modalIconBox, { backgroundColor: "#EFF6FF" }]}>
                <Ionicons name="folder-open" size={22} color="#2563EB" />
              </View>
              <View style={styles.modalOptionInfo}>
                <Text style={styles.modalOptionTitle}>Browse Device Storage</Text>
                <Text style={styles.modalOptionDesc}>
                  Open device file manager to pick PDF or Image
                </Text>
              </View>
            </TouchableOpacity>

            {/* Option 2: Gallery Image */}
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleSimulatedPick("image")}
              activeOpacity={0.7}
            >
              <View style={[styles.modalIconBox, { backgroundColor: "#F0FDF4" }]}>
                <Ionicons name="image" size={22} color="#16A34A" />
              </View>
              <View style={styles.modalOptionInfo}>
                <Text style={styles.modalOptionTitle}>Camera / Image Gallery</Text>
                <Text style={styles.modalOptionDesc}>
                  Attach photo (.jpg, .jpeg, .png)
                </Text>
              </View>
            </TouchableOpacity>

            {/* Option 3: Sample Document PDF */}
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleSimulatedPick("pdf")}
              activeOpacity={0.7}
            >
              <View style={[styles.modalIconBox, { backgroundColor: "#FEF3C7" }]}>
                <Ionicons name="document-text" size={22} color="#D97706" />
              </View>
              <View style={styles.modalOptionInfo}>
                <Text style={styles.modalOptionTitle}>Official Document PDF</Text>
                <Text style={styles.modalOptionDesc}>
                  Attach scanned PDF certificate / copy
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setPickerModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Interactive Full Date Picker Modal */}
      <Modal
        visible={datePickerModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDatePickerModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setDatePickerModalVisible(false)}
        >
          <View style={styles.dateModalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.dateModalHeader}>
              <Text style={styles.modalTitle}>
                {activeDateField?.label || "Select Date"}
              </Text>
              <TouchableOpacity
                onPress={() => setDatePickerModalVisible(false)}
                style={styles.dateCloseBtn}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Live Formatted Date Preview Card */}
            <View style={styles.datePreviewBox}>
              <Ionicons name="calendar" size={20} color="#2563EB" />
              <Text style={styles.datePreviewText}>
                {String(pickerDay).padStart(2, "0")}{" "}
                {MONTH_NAMES[pickerMonth - 1]} {pickerYear}
              </Text>
            </View>

            {/* 3 Columns: Day, Month, Year */}
            <View style={styles.datePickerColumnsRow}>
              {/* Day Column */}
              <View style={styles.dateColWrap}>
                <Text style={styles.dateColTitle}>Day</Text>
                <ScrollView
                  style={styles.dateScrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {Array.from(
                    {
                      length: new Date(pickerYear, pickerMonth, 0).getDate(),
                    },
                    (_, i) => i + 1
                  ).map((d) => {
                    const isSel = d === pickerDay;
                    return (
                      <TouchableOpacity
                        key={d}
                        onPress={() => setPickerDay(d)}
                        style={[styles.dateItemBtn, isSel && styles.dateItemBtnSelected]}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.dateItemText,
                            isSel && styles.dateItemTextSelected,
                          ]}
                        >
                          {String(d).padStart(2, "0")}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Month Column */}
              <View style={styles.dateColWrap}>
                <Text style={styles.dateColTitle}>Month</Text>
                <ScrollView
                  style={styles.dateScrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {MONTH_NAMES.map((mName, mIdx) => {
                    const mNum = mIdx + 1;
                    const isSel = mNum === pickerMonth;
                    return (
                      <TouchableOpacity
                        key={mName}
                        onPress={() => {
                          setPickerMonth(mNum);
                          const maxDaysInNewMonth = new Date(
                            pickerYear,
                            mNum,
                            0
                          ).getDate();
                          if (pickerDay > maxDaysInNewMonth) {
                            setPickerDay(maxDaysInNewMonth);
                          }
                        }}
                        style={[styles.dateItemBtn, isSel && styles.dateItemBtnSelected]}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.dateItemText,
                            isSel && styles.dateItemTextSelected,
                          ]}
                        >
                          {mName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Year Column */}
              <View style={styles.dateColWrap}>
                <Text style={styles.dateColTitle}>Year</Text>
                <ScrollView
                  style={styles.dateScrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {YEARS_LIST.map((y) => {
                    const isSel = y === pickerYear;
                    return (
                      <TouchableOpacity
                        key={y}
                        onPress={() => {
                          setPickerYear(y);
                          const maxDaysInNewYear = new Date(
                            y,
                            pickerMonth,
                            0
                          ).getDate();
                          if (pickerDay > maxDaysInNewYear) {
                            setPickerDay(maxDaysInNewYear);
                          }
                        }}
                        style={[styles.dateItemBtn, isSel && styles.dateItemBtnSelected]}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.dateItemText,
                            isSel && styles.dateItemTextSelected,
                          ]}
                        >
                          {y}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            {/* Modal Actions */}
            <View style={styles.dateActionRow}>
              <TouchableOpacity
                style={styles.dateCancelBtn}
                onPress={() => setDatePickerModalVisible(false)}
                activeOpacity={0.75}
              >
                <Text style={styles.dateCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateSetBtn}
                onPress={handleApplyChosenDate}
                activeOpacity={0.85}
              >
                <Text style={styles.dateSetBtnText}>Apply Date</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  stepTag: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  stepTagText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bodyContainer: {
    flex: 1,
    marginHorizontal: 14,
    marginTop: -32,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
  },
  progressLineWrap: {
    height: 4,
    backgroundColor: "#EFF6FF",
    width: "100%",
  },
  progressActive: {
    height: "100%",
    backgroundColor: "#2563EB",
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  countBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  docFieldGroup: {
    marginBottom: 16,
  },
  docLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  requiredStar: {
    color: "#EF4444",
  },
  uploadingBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    gap: 8,
  },
  uploadingText: {
    fontSize: 12.5,
    color: "#2563EB",
    fontWeight: "600",
  },
  attachedBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    gap: 10,
  },
  attachedName: {
    flex: 1,
    fontSize: 12.5,
    color: "#1E3A8A",
    fontWeight: "600",
  },
  trashBtn: {
    padding: 4,
  },
  dashedBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingVertical: 18,
    gap: 8,
  },
  dashedText: {
    fontSize: 12.5,
    color: "#64748B",
    fontWeight: "500",
  },
  continueBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 10,
    marginBottom: 10,
  },
  continueBtnDisabled: {
    opacity: 0.7,
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 18,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
    gap: 12,
  },
  modalIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOptionInfo: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalOptionDesc: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
  },
  cancelBtn: {
    marginTop: 6,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
  },
  changesSectionWrap: {
    marginTop: 6,
    marginBottom: 8,
  },
  customTextInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "500",
  },
  optionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  optionPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    gap: 6,
  },
  optionPillSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  radioCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    borderColor: "#2563EB",
  },
  radioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2563EB",
  },
  optionPillText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  optionPillTextSelected: {
    color: "#2563EB",
    fontWeight: "700",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 10,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxBoxSelected: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  checkboxLabel: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },
  inputErrorBorder: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
    borderWidth: 1.2,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
    paddingHorizontal: 2,
  },
  errorText: {
    fontSize: 11.5,
    color: "#EF4444",
    fontWeight: "600",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  dateTextInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "500",
  },
  dateCalBtn: {
    padding: 6,
  },
  dateModalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    maxHeight: "82%",
  },
  dateModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dateCloseBtn: {
    padding: 6,
  },
  datePreviewBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 14,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 14,
  },
  datePreviewText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E40AF",
  },
  datePickerColumnsRow: {
    flexDirection: "row",
    gap: 10,
    height: 190,
    marginBottom: 16,
  },
  dateColWrap: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 6,
  },
  dateColTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    textAlign: "center",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  dateScrollView: {
    flex: 1,
  },
  dateItemBtn: {
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  dateItemBtnSelected: {
    backgroundColor: "#2563EB",
  },
  dateItemText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#334155",
  },
  dateItemTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  dateActionRow: {
    flexDirection: "row",
    gap: 10,
  },
  dateCancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  dateCancelBtnText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#64748B",
  },
  dateSetBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  dateSetBtnText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default UploadProofsScreen;