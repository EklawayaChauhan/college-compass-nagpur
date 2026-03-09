export const NAGPUR_COLLEGES = [
  "VNIT - Visvesvaraya National Institute of Technology",
  "RCOEM - Ramdeobaba College of Engineering and Management",
  "PCE - Priyadarshini College of Engineering",
  "YCCE - Yeshwantrao Chavan College of Engineering",
  "KDK College of Engineering",
  "Shri Ramdeobaba College of Engineering",
  "G.H. Raisoni College of Engineering",
  "Laxminarayan Institute of Technology (LIT)",
  "Symbiosis Institute of Technology Nagpur",
  "Nagpur University (RTM) - Main Campus",
  "Hislop College",
  "Morris College of Arts & Commerce",
  "Dharampeth M.P. Deo Memorial Science College",
  "Institute of Management Technology (IMT) Nagpur",
  "Symbiosis Centre for Management Studies Nagpur",
  "Datta Meghe Institute of Medical Sciences",
  "NKP Salve Institute of Medical Sciences",
  "Government Medical College Nagpur",
  "VNIT School of Architecture",
  "Priyadarshini Indira Gandhi College of Engineering",
] as const;

export type CollegeName = typeof NAGPUR_COLLEGES[number];

export interface CollegeInfo {
  name: string;
  type: string;
  ranking: string;
  knownFor: string;
  snippet: string;
}
