export interface InvitationData {
  graduateName: string;
  degree: string;
  university: string;
  graduationDate: string;
  graduationTime: string;
  venue: string;
  address: string;
  message: string;
  familyName: string;
}

export interface Photo {
  id: string;
  from: string;
  image: string;
  caption: string;
  createdAt: string;
}

export interface Message {
  id: string;
  fullname: string;
  is_present: boolean;
  message: string;
  created_at: string;
  updated_at: string;
}

export const invitationData: InvitationData = {
  graduateName: "Muhamad Jamaludin",
  degree: "Sarjana Teknik Informatika",
  university: "Universitas Pasundan",
  graduationDate: "Sabtu, 8 November 2025",
  graduationTime: "13.00 WIB",
  venue: "Wheels Coffee Roasters Juanda",
  address: "klik disini",
  message: "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara wisuda putra/putri kami.",
  familyName: "Keluarga Besar Johnson"
};

export const samplePhotos: Photo[] = [
];

export const sampleMessages: Message[] = [];
