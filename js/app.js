import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, onSnapshot 
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDoGpzQqpro0nVW51x9F2VfZ3k6hkLhAZ8",
  authDomain: "rathi-seeds-bill.firebaseapp.com",
  projectId: "rathi-seeds-bill",
  storageBucket: "rathi-seeds-bill.firebasestorage.app",
  messagingSenderId: "940991039209",
  appId: "1:940991039209:web:34e95b2747195a41eb5278"
};

const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp);

window.App = (() => {
  'use strict';

  let state = {
  "activeView": "dashboard",
  "companies": [
    {
      "id": "CO01",
      "coId": "CO01",
      "name": "Unnati & Samrudhi (Unnati Seeds Co.)"
    },
    {
      "id": "CO02",
      "coId": "CO02",
      "name": "SKB Seeds"
    },
    {
      "id": "CO03",
      "coId": "CO03",
      "name": "Booster Seeds"
    },
    {
      "id": "CO04",
      "coId": "CO04",
      "name": "Savira Seeds"
    }
  ],
  "seeds": [
    {
      "id": "S001",
      "seedId": "S001",
      "companyId": "CO01",
      "name": "Unnati",
      "weight": 25,
      "currentRate": 3500
    },
    {
      "id": "S002",
      "seedId": "S002",
      "companyId": "CO01",
      "name": "Samrudhi",
      "weight": 25,
      "currentRate": 3500
    },
    {
      "id": "S003",
      "seedId": "S003",
      "companyId": "CO02",
      "name": "Pushpa",
      "weight": 25,
      "currentRate": 2999
    },
    {
      "id": "S004",
      "seedId": "S004",
      "companyId": "CO02",
      "name": "Avantika",
      "weight": 27,
      "currentRate": 3199
    },
    {
      "id": "S005",
      "seedId": "S005",
      "companyId": "CO03",
      "name": "Hututu",
      "weight": 25,
      "currentRate": 3000
    },
    {
      "id": "S006",
      "seedId": "S006",
      "companyId": "CO03",
      "name": "Kho Kho",
      "weight": 25,
      "currentRate": 3000
    },
    {
      "id": "S007",
      "seedId": "S007",
      "companyId": "CO03",
      "name": "Tur BDN716",
      "weight": null,
      "currentRate": 250
    },
    {
      "id": "S008",
      "seedId": "S008",
      "companyId": "CO03",
      "name": "Lal Kranti",
      "weight": null,
      "currentRate": 250
    },
    {
      "id": "S009",
      "seedId": "S009",
      "companyId": "CO03",
      "name": "Cotton",
      "weight": null,
      "currentRate": null
    },
    {
      "id": "S010",
      "seedId": "S010",
      "companyId": "CO04",
      "name": "Baliraja",
      "weight": 27,
      "currentRate": null
    }
  ],
  "parties": [
    {
      "id": "Maa Bhavani",
      "name": "Maa Bhavani",
      "center": "Agargaon",
      "phone": null
    },
    {
      "id": "Jai Mata di",
      "name": "Jai Mata di",
      "center": "Alipur",
      "phone": null
    },
    {
      "id": "Bhojaji",
      "name": "Bhojaji",
      "center": "Alipur",
      "phone": null
    },
    {
      "id": "Krushi Seva",
      "name": "Krushi Seva",
      "center": "Alipur",
      "phone": null
    },
    {
      "id": "Kuratkar",
      "name": "Kuratkar",
      "center": "Andori",
      "phone": null
    },
    {
      "id": "Gajanan",
      "name": "Gajanan",
      "center": "Andori",
      "phone": null
    },
    {
      "id": "Zumde",
      "name": "Zumde",
      "center": "Andori",
      "phone": null
    },
    {
      "id": "Shri Sai",
      "name": "Shri Sai",
      "center": "Andori",
      "phone": null
    },
    {
      "id": "Dhole k k",
      "name": "Dhole k k",
      "center": "Andori",
      "phone": null
    },
    {
      "id": "Maa Bhavani k k",
      "name": "Maa Bhavani k k",
      "center": "Andori",
      "phone": null
    },
    {
      "id": "Govind k k",
      "name": "Govind k k",
      "center": "Bhankheda",
      "phone": null
    },
    {
      "id": "Sai k k",
      "name": "Sai k k",
      "center": "Bhankheda",
      "phone": null
    },
    {
      "id": "Meher Baba",
      "name": "Meher Baba",
      "center": "Bhankheda",
      "phone": null
    },
    {
      "id": "Aarya K K",
      "name": "Aarya K K",
      "center": "Bhankheda",
      "phone": null
    },
    {
      "id": "Sheetal K K",
      "name": "Sheetal K K",
      "center": "Bhidi",
      "phone": null
    },
    {
      "id": "Nitin k k",
      "name": "Nitin k k",
      "center": "Bhidi",
      "phone": null
    },
    {
      "id": "Wadera k k",
      "name": "Wadera k k",
      "center": "Bhidi",
      "phone": null
    },
    {
      "id": "Shetkari",
      "name": "Shetkari",
      "center": "Bhidi",
      "phone": null
    },
    {
      "id": "Jai baba",
      "name": "Jai baba",
      "center": "Bhidi",
      "phone": null
    },
    {
      "id": "Piyush k k",
      "name": "Piyush k k",
      "center": "Borgaon",
      "phone": null
    },
    {
      "id": "Kashikar k k",
      "name": "Kashikar k k",
      "center": "Deoli",
      "phone": null
    },
    {
      "id": "Umre",
      "name": "Umre",
      "center": "Deoli",
      "phone": null
    },
    {
      "id": "Gurudeo k k",
      "name": "Gurudeo k k",
      "center": "Deoli",
      "phone": null
    },
    {
      "id": "Badnore A",
      "name": "Badnore A",
      "center": "Deoli",
      "phone": null
    },
    {
      "id": "Sagar k k",
      "name": "Sagar k k",
      "center": "Deoli",
      "phone": null
    },
    {
      "id": "Monali",
      "name": "Monali",
      "center": "Deoli",
      "phone": null
    },
    {
      "id": "Bhoyar k k",
      "name": "Bhoyar k k",
      "center": "Deoli",
      "phone": null
    },
    {
      "id": "Arade",
      "name": "Arade",
      "center": "Deoli",
      "phone": null
    },
    {
      "id": "Mahajan",
      "name": "Mahajan",
      "center": "Deoli",
      "phone": null
    },
    {
      "id": "Shri krushi vikas",
      "name": "Shri krushi vikas",
      "center": "Deoli",
      "phone": null
    },
    {
      "id": "Krushi Mitra",
      "name": "Krushi Mitra",
      "center": "Deoli",
      "phone": null
    },
    {
      "id": "Chintamani K K",
      "name": "Chintamani K K",
      "center": "Deoli",
      "phone": null
    },
    {
      "id": "Sidhi K k",
      "name": "Sidhi K k",
      "center": "Deoli",
      "phone": null
    },
    {
      "id": "Krushi Suvidha",
      "name": "Krushi Suvidha",
      "center": "Deoli",
      "phone": null
    },
    {
      "id": "Pratik K K",
      "name": "Pratik K K",
      "center": "Dhegaon",
      "phone": null
    },
    {
      "id": "Bhojaji k k",
      "name": "Bhojaji k k",
      "center": "Dhegaon",
      "phone": null
    },
    {
      "id": "Sachin k k",
      "name": "Sachin k k",
      "center": "Girad",
      "phone": null
    },
    {
      "id": "Jai Kisan k k",
      "name": "Jai Kisan k k",
      "center": "Girad",
      "phone": null
    },
    {
      "id": "Mahalaxmi k k",
      "name": "Mahalaxmi k k",
      "center": "Girad",
      "phone": null
    },
    {
      "id": "Gourkar k k",
      "name": "Gourkar k k",
      "center": "Girad",
      "phone": null
    },
    {
      "id": "Gajanan Maharaj",
      "name": "Gajanan Maharaj",
      "center": "Girad",
      "phone": null
    },
    {
      "id": "Vidharbh",
      "name": "Vidharbh",
      "center": "Girad",
      "phone": null
    },
    {
      "id": "Kisan Mauli",
      "name": "Kisan Mauli",
      "center": "Girad",
      "phone": null
    },
    {
      "id": "Wagh K k",
      "name": "Wagh K k",
      "center": "Girad",
      "phone": null
    },
    {
      "id": "Rajesh k k",
      "name": "Rajesh k k",
      "center": "Girad",
      "phone": null
    },
    {
      "id": "Ahish K K",
      "name": "Ahish K K",
      "center": "Girad",
      "phone": null
    },
    {
      "id": "Mangal Murti",
      "name": "Mangal Murti",
      "center": "Ghorad",
      "phone": null
    },
    {
      "id": "Shiv Krupa",
      "name": "Shiv Krupa",
      "center": "Ghorad",
      "phone": null
    },
    {
      "id": "Raut k k",
      "name": "Raut k k",
      "center": "Ghorad",
      "phone": null
    },
    {
      "id": "Swami samarth",
      "name": "Swami samarth",
      "center": "Ghorad",
      "phone": null
    },
    {
      "id": "Sushil",
      "name": "Sushil",
      "center": "Ghorad",
      "phone": null
    },
    {
      "id": "Sidhi Vinayak",
      "name": "Sidhi Vinayak",
      "center": "Ghorad",
      "phone": null
    },
    {
      "id": "Hari Krupa",
      "name": "Hari Krupa",
      "center": "Hamdapur",
      "phone": null
    },
    {
      "id": "Shende k k",
      "name": "Shende k k",
      "center": "Hamdapur",
      "phone": null
    },
    {
      "id": "Shetkari k k",
      "name": "Shetkari k k",
      "center": "Hamdapur",
      "phone": null
    },
    {
      "id": "Samta k k",
      "name": "Samta k k",
      "center": "Hamdapur",
      "phone": null
    },
    {
      "id": "Bhoyar",
      "name": "Bhoyar",
      "center": "Hamdapur",
      "phone": null
    },
    {
      "id": "Maa Bhavani",
      "name": "Maa Bhavani",
      "center": "Hamdapur",
      "phone": null
    },
    {
      "id": "Pankaj",
      "name": "Pankaj",
      "center": "Hamdapur",
      "phone": null
    },
    {
      "id": "Dhananjay k k",
      "name": "Dhananjay k k",
      "center": "Hamdapur",
      "phone": null
    },
    {
      "id": "Shriram k k",
      "name": "Shriram k k",
      "center": "Hamdapur",
      "phone": null
    },
    {
      "id": "Sai k k",
      "name": "Sai k k",
      "center": "Hamdapur",
      "phone": null
    },
    {
      "id": "Sairaj k k",
      "name": "Sairaj k k",
      "center": "Hamdapur",
      "phone": null
    },
    {
      "id": "Krushi seva",
      "name": "Krushi seva",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Saraswati k k",
      "name": "Saraswati k k",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Majeshet k k",
      "name": "Majeshet k k",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Sancklecha",
      "name": "Sancklecha",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Kothari k k",
      "name": "Kothari k k",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Kisan Bandhu",
      "name": "Kisan Bandhu",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Maa Bhavani",
      "name": "Maa Bhavani",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Chandrabhaga",
      "name": "Chandrabhaga",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Ravi Seeds",
      "name": "Ravi Seeds",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Abhay seeds",
      "name": "Abhay seeds",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Samrudhi",
      "name": "Samrudhi",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Kochar Biyane",
      "name": "Kochar Biyane",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Kochar k k",
      "name": "Kochar k k",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Balpande k k",
      "name": "Balpande k k",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Sachin k k",
      "name": "Sachin k k",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Shivneri k k",
      "name": "Shivneri k k",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Shri k k",
      "name": "Shri k k",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Badiraja k k",
      "name": "Badiraja k k",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Mahalaxmi k k",
      "name": "Mahalaxmi k k",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Ganga sales",
      "name": "Ganga sales",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Rajendra k k",
      "name": "Rajendra k k",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Deotale",
      "name": "Deotale",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Shri hari k k",
      "name": "Shri hari k k",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Balaji k k",
      "name": "Balaji k k",
      "center": "Inzala",
      "phone": null
    },
    {
      "id": "Mahalaxmi k k",
      "name": "Mahalaxmi k k",
      "center": "Inzala",
      "phone": null
    },
    {
      "id": "Sairam k",
      "name": "Sairam k",
      "center": "Nachangaon",
      "phone": null
    },
    {
      "id": "Mauli k k",
      "name": "Mauli k k",
      "center": "Nachangaon",
      "phone": null
    },
    {
      "id": "Priya k k",
      "name": "Priya k k",
      "center": "Nachangaon",
      "phone": null
    },
    {
      "id": "Kisan k k",
      "name": "Kisan k k",
      "center": "Nachangaon",
      "phone": null
    },
    {
      "id": "Mauli k k",
      "name": "Mauli k k",
      "center": "Junona",
      "phone": null
    },
    {
      "id": "Trimurti",
      "name": "Trimurti",
      "center": "Junona",
      "phone": null
    },
    {
      "id": "Badiraja k k",
      "name": "Badiraja k k",
      "center": "Junona",
      "phone": null
    },
    {
      "id": "Raut k k",
      "name": "Raut k k",
      "center": "Kandhali",
      "phone": null
    },
    {
      "id": "Ghanchaya",
      "name": "Ghanchaya",
      "center": "Kandhali",
      "phone": null
    },
    {
      "id": "Santaji",
      "name": "Santaji",
      "center": "Kandhali",
      "phone": null
    },
    {
      "id": "Avchat k k",
      "name": "Avchat k k",
      "center": "Kandhali",
      "phone": null
    },
    {
      "id": "Dekate",
      "name": "Dekate",
      "center": "Karanji Bhoge",
      "phone": null
    },
    {
      "id": "Bhumiputra k k",
      "name": "Bhumiputra k k",
      "center": "Karanji Bhoge",
      "phone": null
    },
    {
      "id": "Chintamani K K",
      "name": "Chintamani K K",
      "center": "Kelzar",
      "phone": null
    },
    {
      "id": "Anand Traders",
      "name": "Anand Traders",
      "center": "Kelzar",
      "phone": null
    },
    {
      "id": "Kelzar k k",
      "name": "Kelzar k k",
      "center": "Kelzar",
      "phone": null
    },
    {
      "id": "Sidhi Vinayak",
      "name": "Sidhi Vinayak",
      "center": "Kelzar",
      "phone": null
    },
    {
      "id": "Jagdamb k k",
      "name": "Jagdamb k k",
      "center": "Kora",
      "phone": null
    },
    {
      "id": "Swayam k k",
      "name": "Swayam k k",
      "center": "Kora",
      "phone": null
    },
    {
      "id": "Amruta k k",
      "name": "Amruta k k",
      "center": "Kora",
      "phone": null
    },
    {
      "id": "Pragati k k",
      "name": "Pragati k k",
      "center": "Kora",
      "phone": null
    },
    {
      "id": "Adarsh k k",
      "name": "Adarsh k k",
      "center": "Kora",
      "phone": null
    },
    {
      "id": "Nagdi k k",
      "name": "Nagdi k k",
      "center": "Kora",
      "phone": null
    },
    {
      "id": "Shri Ganesh",
      "name": "Shri Ganesh",
      "center": "Kora",
      "phone": null
    },
    {
      "id": "Ayush k k",
      "name": "Ayush k k",
      "center": "Kora",
      "phone": null
    },
    {
      "id": "Bhandakkar",
      "name": "Bhandakkar",
      "center": "Kora",
      "phone": null
    },
    {
      "id": "Isankar k k",
      "name": "Isankar k k",
      "center": "Kora",
      "phone": null
    },
    {
      "id": "Laxmi k k",
      "name": "Laxmi k k",
      "center": "Mahakal",
      "phone": null
    },
    {
      "id": "Mahesh K K",
      "name": "Mahesh K K",
      "center": "Mandgaon",
      "phone": null
    },
    {
      "id": "Krushi Mitra",
      "name": "Krushi Mitra",
      "center": "Mandgaon",
      "phone": null
    },
    {
      "id": "Bharat k k",
      "name": "Bharat k k",
      "center": "Mandgaon",
      "phone": null
    },
    {
      "id": "Kastakar k k",
      "name": "Kastakar k k",
      "center": "Mandgaon",
      "phone": null
    },
    {
      "id": "Farmer Producer",
      "name": "Farmer Producer",
      "center": "Mandgaon",
      "phone": null
    },
    {
      "id": "Sahil",
      "name": "Sahil",
      "center": "Mandgaon",
      "phone": null
    },
    {
      "id": "Parate",
      "name": "Parate",
      "center": "Hingni",
      "phone": null
    },
    {
      "id": "Bhavani",
      "name": "Bhavani",
      "center": "Hingni",
      "phone": null
    },
    {
      "id": "Watkar",
      "name": "Watkar",
      "center": "Hingni",
      "phone": null
    },
    {
      "id": "Bhaskar",
      "name": "Bhaskar",
      "center": "Hingni",
      "phone": null
    },
    {
      "id": "Sai k k",
      "name": "Sai k k",
      "center": "Nandori",
      "phone": null
    },
    {
      "id": "Taori K  k",
      "name": "Taori K  k",
      "center": "Pulgaon",
      "phone": null
    },
    {
      "id": "Dhamiya k k",
      "name": "Dhamiya k k",
      "center": "Pulgaon",
      "phone": null
    },
    {
      "id": "Kisan A A",
      "name": "Kisan A A",
      "center": "Pulgaon",
      "phone": null
    },
    {
      "id": "Chintamani K K",
      "name": "Chintamani K K",
      "center": "Pulgaon",
      "phone": null
    },
    {
      "id": "Saibaba K k",
      "name": "Saibaba K k",
      "center": "Pulgaon",
      "phone": null
    },
    {
      "id": "Kanoba A Ag",
      "name": "Kanoba A Ag",
      "center": "Pulgaon",
      "phone": null
    },
    {
      "id": "Priya fertilizers",
      "name": "Priya fertilizers",
      "center": "Pulgaon",
      "phone": null
    },
    {
      "id": "Vaishnavi k k",
      "name": "Vaishnavi k k",
      "center": "Rehki",
      "phone": null
    },
    {
      "id": "Ganesh k k",
      "name": "Ganesh k k",
      "center": "Rehki",
      "phone": null
    },
    {
      "id": "Jaiswal k k",
      "name": "Jaiswal k k",
      "center": "Rehki",
      "phone": null
    },
    {
      "id": "Shree Ram K K",
      "name": "Shree Ram K K",
      "center": "Samudrapur",
      "phone": null
    },
    {
      "id": "Krishi Kranti",
      "name": "Krishi Kranti",
      "center": "Samudrapur",
      "phone": null
    },
    {
      "id": "Jain Traders",
      "name": "Jain Traders",
      "center": "Samudrapur",
      "phone": null
    },
    {
      "id": "Kastakar k k",
      "name": "Kastakar k k",
      "center": "Samudrapur",
      "phone": null
    },
    {
      "id": "Shri Gajanan",
      "name": "Shri Gajanan",
      "center": "Samudrapur",
      "phone": null
    },
    {
      "id": "Shankar",
      "name": "Shankar",
      "center": "Samudrapur",
      "phone": null
    },
    {
      "id": "Bhojaji k k",
      "name": "Bhojaji k k",
      "center": "Samudrapur",
      "phone": null
    },
    {
      "id": "Zade k k",
      "name": "Zade k k",
      "center": "Samudrapur",
      "phone": null
    },
    {
      "id": "Gurudeo k k",
      "name": "Gurudeo k k",
      "center": "Samudrapur",
      "phone": null
    },
    {
      "id": "Maa Laxmi k k",
      "name": "Maa Laxmi k k",
      "center": "Samudrapur",
      "phone": null
    },
    {
      "id": "Sanket k k",
      "name": "Sanket k k",
      "center": "Samudrapur",
      "phone": null
    },
    {
      "id": "Whagheda framer pro",
      "name": "Whagheda framer pro",
      "center": "Samudrapur",
      "phone": null
    },
    {
      "id": "Badiraja k k",
      "name": "Badiraja k k",
      "center": "Samudrapur",
      "phone": null
    },
    {
      "id": "Agrawal k k",
      "name": "Agrawal k k",
      "center": "Samudrapur",
      "phone": null
    },
    {
      "id": "Ande k k",
      "name": "Ande k k",
      "center": "Samudrapur",
      "phone": null
    },
    {
      "id": "Babulkar K K",
      "name": "Babulkar K K",
      "center": "Samudrapur",
      "phone": null
    },
    {
      "id": "Krushi mitra",
      "name": "Krushi mitra",
      "center": "Selu",
      "phone": null
    },
    {
      "id": "Parag K k",
      "name": "Parag K k",
      "center": "Selu",
      "phone": null
    },
    {
      "id": "Mahalaxmi k",
      "name": "Mahalaxmi k",
      "center": "Selu",
      "phone": null
    },
    {
      "id": "Jai Bajrang",
      "name": "Jai Bajrang",
      "center": "Selu",
      "phone": null
    },
    {
      "id": "Radha k k",
      "name": "Radha k k",
      "center": "Selu",
      "phone": null
    },
    {
      "id": "Jain k k",
      "name": "Jain k k",
      "center": "Selu",
      "phone": null
    },
    {
      "id": "Dhanashri",
      "name": "Dhanashri",
      "center": "Selu",
      "phone": null
    },
    {
      "id": "Jailaxmi K K",
      "name": "Jailaxmi K K",
      "center": "Selu",
      "phone": null
    },
    {
      "id": "Gurukrupa Organic",
      "name": "Gurukrupa Organic",
      "center": "Selu",
      "phone": null
    },
    {
      "id": "Bhushan k k",
      "name": "Bhushan k k",
      "center": "Sindhi Rly",
      "phone": null
    },
    {
      "id": "Shetmauli k k",
      "name": "Shetmauli k k",
      "center": "Sindhi Rly",
      "phone": null
    },
    {
      "id": "Venkatesh",
      "name": "Venkatesh",
      "center": "Sindhi Rly",
      "phone": null
    },
    {
      "id": "Kirti",
      "name": "Kirti",
      "center": "Sindhi Rly",
      "phone": null
    },
    {
      "id": "Narayan k k",
      "name": "Narayan k k",
      "center": "Sindhi Rly",
      "phone": null
    },
    {
      "id": "Jaikisan",
      "name": "Jaikisan",
      "center": "Sindhi Rly",
      "phone": null
    },
    {
      "id": "Kisan Tr Co",
      "name": "Kisan Tr Co",
      "center": "Sindhi Rly",
      "phone": null
    },
    {
      "id": "Shetkari Suvhidha",
      "name": "Shetkari Suvhidha",
      "center": "Sindhi Rly",
      "phone": null
    },
    {
      "id": "Shree Seeds",
      "name": "Shree Seeds",
      "center": "Talegaon",
      "phone": null
    },
    {
      "id": "Balaji k k",
      "name": "Balaji k k",
      "center": "Talegaon",
      "phone": null
    },
    {
      "id": "Rutika k k",
      "name": "Rutika k k",
      "center": "Talni",
      "phone": null
    },
    {
      "id": "Jai Jagannath",
      "name": "Jai Jagannath",
      "center": "Vashi",
      "phone": null
    },
    {
      "id": "Pragati kk",
      "name": "Pragati kk",
      "center": "Vashi",
      "phone": null
    },
    {
      "id": "Mirani k k",
      "name": "Mirani k k",
      "center": "Waigaon",
      "phone": null
    },
    {
      "id": "Balaji k k",
      "name": "Balaji k k",
      "center": "Waigaon",
      "phone": null
    },
    {
      "id": "Kartik k k",
      "name": "Kartik k k",
      "center": "Waigaon",
      "phone": null
    },
    {
      "id": "Nagrale k k",
      "name": "Nagrale k k",
      "center": "Waigaon",
      "phone": null
    },
    {
      "id": "Laxmi k k",
      "name": "Laxmi k k",
      "center": "Waigaon",
      "phone": null
    },
    {
      "id": "Annadata kk",
      "name": "Annadata kk",
      "center": "Waigaon",
      "phone": null
    },
    {
      "id": "Pawan k Mandir",
      "name": "Pawan k Mandir",
      "center": "Waigaon",
      "phone": null
    },
    {
      "id": "Om krushi mandir",
      "name": "Om krushi mandir",
      "center": "Waigaon",
      "phone": null
    },
    {
      "id": "Jagdamba K K",
      "name": "Jagdamba K K",
      "center": "Waigaon",
      "phone": null
    },
    {
      "id": "Sethkari K K",
      "name": "Sethkari K K",
      "center": "Waigaon",
      "phone": null
    },
    {
      "id": "Wankhede A A",
      "name": "Wankhede A A",
      "center": "Wardha",
      "phone": null
    },
    {
      "id": "Dhartidhan",
      "name": "Dhartidhan",
      "center": "Wardha",
      "phone": null
    },
    {
      "id": "Mahakali",
      "name": "Mahakali",
      "center": "Wardha",
      "phone": null
    },
    {
      "id": "Shri Seeds",
      "name": "Shri Seeds",
      "center": "Wardha",
      "phone": null
    },
    {
      "id": "Govind A A",
      "name": "Govind A A",
      "center": "Wardha",
      "phone": null
    },
    {
      "id": "Akshay Seeds",
      "name": "Akshay Seeds",
      "center": "Wardha",
      "phone": null
    },
    {
      "id": "Patil k k",
      "name": "Patil k k",
      "center": "Wardha",
      "phone": null
    },
    {
      "id": "Vidharbh A A",
      "name": "Vidharbh A A",
      "center": "Wardha",
      "phone": null
    },
    {
      "id": "Vidharbh k k",
      "name": "Vidharbh k k",
      "center": "Wardha",
      "phone": null
    },
    {
      "id": "Shri Agro",
      "name": "Shri Agro",
      "center": "Wardha",
      "phone": null
    },
    {
      "id": "Nitin Marketing",
      "name": "Nitin Marketing",
      "center": "Wardha",
      "phone": null
    },
    {
      "id": "Kothari k k",
      "name": "Kothari k k",
      "center": "Wardha",
      "phone": null
    },
    {
      "id": "Badnore Agro",
      "name": "Badnore Agro",
      "center": "Wardha",
      "phone": null
    },
    {
      "id": "Gayatri Biyane",
      "name": "Gayatri Biyane",
      "center": "Wardha",
      "phone": null
    },
    {
      "id": "Chandak A Cen",
      "name": "Chandak A Cen",
      "center": "Wardha",
      "phone": null
    },
    {
      "id": "Chandak Traders",
      "name": "Chandak Traders",
      "center": "Wardha",
      "phone": null
    },
    {
      "id": "Gayatri Ramnagar",
      "name": "Gayatri Ramnagar",
      "center": "Wardha",
      "phone": null
    },
    {
      "id": "Rathi Traders",
      "name": "Rathi Traders",
      "center": "Wardha",
      "phone": null
    },
    {
      "id": "Mauli k k",
      "name": "Mauli k k",
      "center": "Ghunkheda",
      "phone": null
    },
    {
      "id": "Shende Bandhu",
      "name": "Shende Bandhu",
      "center": "Barbadi",
      "phone": null
    },
    {
      "id": "Kiran k k",
      "name": "Kiran k k",
      "center": "Pawnar",
      "phone": null
    },
    {
      "id": "Prem k k",
      "name": "Prem k k",
      "center": "Pawnar",
      "phone": null
    },
    {
      "id": "Gurudeo k k",
      "name": "Gurudeo k k",
      "center": "Pawnar",
      "phone": null
    },
    {
      "id": "Bhumiputra",
      "name": "Bhumiputra",
      "center": "Anji",
      "phone": null
    },
    {
      "id": "Gupta",
      "name": "Gupta",
      "center": "Anji",
      "phone": null
    },
    {
      "id": "Krushi Mitra",
      "name": "Krushi Mitra",
      "center": "Anji",
      "phone": null
    },
    {
      "id": "Sai k k",
      "name": "Sai k k",
      "center": "Anji",
      "phone": null
    },
    {
      "id": "Shri Agro",
      "name": "Shri Agro",
      "center": "Anji",
      "phone": null
    },
    {
      "id": "Krushi Seva kendre",
      "name": "Krushi Seva kendre",
      "center": "Taroda",
      "phone": null
    },
    {
      "id": "Kejaji k k",
      "name": "Kejaji k k",
      "center": "Taroda",
      "phone": null
    },
    {
      "id": "Kejaji A Traders",
      "name": "Kejaji A Traders",
      "center": "Taroda",
      "phone": null
    },
    {
      "id": "Kunal A A",
      "name": "Kunal A A",
      "center": "Taroda",
      "phone": null
    },
    {
      "id": "Sai k k",
      "name": "Sai k k",
      "center": "Taroda",
      "phone": null
    },
    {
      "id": "Maa Vaishnavi",
      "name": "Maa Vaishnavi",
      "center": "Taroda",
      "phone": null
    },
    {
      "id": "Shri Venkatesh",
      "name": "Shri Venkatesh",
      "center": "Taroda",
      "phone": null
    },
    {
      "id": "Satvik k k",
      "name": "Satvik k k",
      "center": "Salod",
      "phone": null
    },
    {
      "id": "Renuka",
      "name": "Renuka",
      "center": "Salod",
      "phone": null
    },
    {
      "id": "KISANHELP AGRO",
      "name": "KISANHELP AGRO",
      "center": "Salod",
      "phone": null
    },
    {
      "id": "Radhika k",
      "name": "Radhika k",
      "center": "Salod",
      "phone": null
    },
    {
      "id": "Radheyshyam Traders",
      "name": "Radheyshyam Traders",
      "center": "Salod",
      "phone": null
    },
    {
      "id": "Bhagat Laxmi",
      "name": "Bhagat Laxmi",
      "center": "Dongargaon",
      "phone": null
    },
    {
      "id": "Vasundhara",
      "name": "Vasundhara",
      "center": "Borgaon",
      "phone": null
    },
    {
      "id": "Shetkari k k",
      "name": "Shetkari k k",
      "center": "Swali Wagh",
      "phone": null
    },
    {
      "id": "Dhiraj k k",
      "name": "Dhiraj k k",
      "center": "Swali Wagh",
      "phone": null
    },
    {
      "id": "Tulza Bhavani k k",
      "name": "Tulza Bhavani k k",
      "center": "Pailanpur",
      "phone": null
    },
    {
      "id": "Arihant k k",
      "name": "Arihant k k",
      "center": "Vijay Gopal",
      "phone": null
    },
    {
      "id": "Vikaram KSK",
      "name": "Vikaram KSK",
      "center": "Vijay Gopal",
      "phone": null
    },
    {
      "id": "Uday k k",
      "name": "Uday k k",
      "center": "Sirasgaon",
      "phone": null
    },
    {
      "id": "Astavinayak",
      "name": "Astavinayak",
      "center": "Sirasgaon",
      "phone": null
    },
    {
      "id": "Amol k k",
      "name": "Amol k k",
      "center": "Wadner",
      "phone": null
    },
    {
      "id": "Bhuthada Fertilizer",
      "name": "Bhuthada Fertilizer",
      "center": "Majra",
      "phone": null
    },
    {
      "id": "Bhojaji",
      "name": "Bhojaji",
      "center": "Madni",
      "phone": null
    },
    {
      "id": "Tarachand",
      "name": "Tarachand",
      "center": "Madni",
      "phone": null
    },
    {
      "id": "Ram k k",
      "name": "Ram k k",
      "center": "Madni",
      "phone": null
    },
    {
      "id": "Pratik A A",
      "name": "Pratik A A",
      "center": "Jaipur",
      "phone": null
    },
    {
      "id": "Saraswati k k",
      "name": "Saraswati k k",
      "center": "Padegaon",
      "phone": null
    },
    {
      "id": "Chintamani K K",
      "name": "Chintamani K K",
      "center": "Whagholi",
      "phone": null
    },
    {
      "id": "Mende",
      "name": "Mende",
      "center": "Whagholi",
      "phone": null
    },
    {
      "id": "Matoshri",
      "name": "Matoshri",
      "center": "Whagholi",
      "phone": null
    },
    {
      "id": "Sant Gajanan",
      "name": "Sant Gajanan",
      "center": "Whagholi",
      "phone": null
    },
    {
      "id": "Kastakar k k",
      "name": "Kastakar k k",
      "center": "Whagholi",
      "phone": null
    },
    {
      "id": "Matrubhumi",
      "name": "Matrubhumi",
      "center": "Whagholi",
      "phone": null
    },
    {
      "id": "Shri Sai",
      "name": "Shri Sai",
      "center": "Whagholi",
      "phone": null
    },
    {
      "id": "Bhende",
      "name": "Bhende",
      "center": "Whagholi",
      "phone": null
    },
    {
      "id": "Sadguru",
      "name": "Sadguru",
      "center": "Whagholi",
      "phone": null
    },
    {
      "id": "Anshika",
      "name": "Anshika",
      "center": "Asta",
      "phone": null
    },
    {
      "id": "Shri Krushna",
      "name": "Shri Krushna",
      "center": "Asta",
      "phone": null
    },
    {
      "id": "Bothara",
      "name": "Bothara",
      "center": "Pohana",
      "phone": null
    },
    {
      "id": "Jain k k",
      "name": "Jain k k",
      "center": "Pohana",
      "phone": null
    },
    {
      "id": "Datta",
      "name": "Datta",
      "center": "Virul",
      "phone": null
    },
    {
      "id": "Shetkari k k",
      "name": "Shetkari k k",
      "center": "Virul",
      "phone": null
    },
    {
      "id": "Om krushi kendre",
      "name": "Om krushi kendre",
      "center": "Giroli",
      "phone": null
    },
    {
      "id": "Ghongde",
      "name": "Ghongde",
      "center": "Jamni",
      "phone": null
    },
    {
      "id": "Hore k k",
      "name": "Hore k k",
      "center": "ShirPur",
      "phone": null
    },
    {
      "id": "Maa Bhavani",
      "name": "Maa Bhavani",
      "center": "Kanhapur",
      "phone": null
    },
    {
      "id": "Jai bhole k k",
      "name": "Jai bhole k k",
      "center": "Kanhapur",
      "phone": null
    },
    {
      "id": "Jai bhole k k",
      "name": "Jai bhole k k",
      "center": "Bhugaon",
      "phone": null
    },
    {
      "id": "Jai Laxmi k k",
      "name": "Jai Laxmi k k",
      "center": "Sekhapur Vai",
      "phone": null
    },
    {
      "id": "Jain Traders",
      "name": "Jain Traders",
      "center": "Rohana",
      "phone": null
    },
    {
      "id": "prabhama",
      "name": "prabhama",
      "center": "Rohana",
      "phone": null
    },
    {
      "id": "Priyanka",
      "name": "Priyanka",
      "center": "Sarwadi",
      "phone": null
    },
    {
      "id": "Shrayaas k k",
      "name": "Shrayaas k k",
      "center": "Mandwa",
      "phone": null
    },
    {
      "id": "Matoshri",
      "name": "Matoshri",
      "center": "Adegaon",
      "phone": null
    },
    {
      "id": "Sairam k k",
      "name": "Sairam k k",
      "center": "Gondapur",
      "phone": null
    },
    {
      "id": "Sairam k k",
      "name": "Sairam k k",
      "center": "Vikni",
      "phone": null
    },
    {
      "id": "Samarth",
      "name": "Samarth",
      "center": "Pawni",
      "phone": null
    },
    {
      "id": "Shende k k",
      "name": "Shende k k",
      "center": "Jam",
      "phone": null
    },
    {
      "id": "Shetkari k k",
      "name": "Shetkari k k",
      "center": "Whaghala",
      "phone": null
    },
    {
      "id": "Jikar k k",
      "name": "Jikar k k",
      "center": "Whaghala",
      "phone": null
    },
    {
      "id": "Shetmauli",
      "name": "Shetmauli",
      "center": "Inzapur",
      "phone": null
    },
    {
      "id": "Tejas",
      "name": "Tejas",
      "center": "Kopara",
      "phone": null
    },
    {
      "id": "jai Bajrang",
      "name": "jai Bajrang",
      "center": "Paloti",
      "phone": null
    },
    {
      "id": "Pragati kk",
      "name": "Pragati kk",
      "center": "Sukali Station",
      "phone": null
    },
    {
      "id": "Maa Vaishnavi",
      "name": "Maa Vaishnavi",
      "center": "Morchapur",
      "phone": null
    },
    {
      "id": "Shridev",
      "name": "Shridev",
      "center": "Karanji Kaji",
      "phone": null
    },
    {
      "id": "Bhagat k k",
      "name": "Bhagat k k",
      "center": "Yelakeli",
      "phone": null
    },
    {
      "id": "Swami samarth",
      "name": "Swami samarth",
      "center": "Yelakeli",
      "phone": null
    },
    {
      "id": "Lonkar k k",
      "name": "Lonkar k k",
      "center": "Wela",
      "phone": null
    },
    {
      "id": "Astavinayak",
      "name": "Astavinayak",
      "center": "Wela",
      "phone": null
    },
    {
      "id": "Shradha",
      "name": "Shradha",
      "center": "Wela",
      "phone": null
    },
    {
      "id": "Kapse",
      "name": "Kapse",
      "center": "Goji",
      "phone": null
    },
    {
      "id": "Dharne",
      "name": "Dharne",
      "center": "Dhagaon",
      "phone": null
    },
    {
      "id": "Sagar k k",
      "name": "Sagar k k",
      "center": "yesamba",
      "phone": null
    },
    {
      "id": "Bhikaji k k",
      "name": "Bhikaji k k",
      "center": "Waigaon Gond",
      "phone": null
    },
    {
      "id": "Shetkari k k",
      "name": "Shetkari k k",
      "center": "Akorli",
      "phone": null
    },
    {
      "id": "Chandak A Cen",
      "name": "Chandak A Cen",
      "center": "Arvi",
      "phone": null
    },
    {
      "id": "Agrawal k k",
      "name": "Agrawal k k",
      "center": "Arvi",
      "phone": null
    },
    {
      "id": "Jaishree K k",
      "name": "Jaishree K k",
      "center": "Arvi",
      "phone": null
    },
    {
      "id": "Milind k k",
      "name": "Milind k k",
      "center": "Surgaon",
      "phone": null
    },
    {
      "id": "Mahalaxmi k k",
      "name": "Mahalaxmi k k",
      "center": "Kharangna Gode",
      "phone": null
    },
    {
      "id": "Tulza Bhavani k k",
      "name": "Tulza Bhavani k k",
      "center": "Wadona",
      "phone": null
    },
    {
      "id": "Om Sai",
      "name": "Om Sai",
      "center": "Wadona",
      "phone": null
    },
    {
      "id": "Krushna k k",
      "name": "Krushna k k",
      "center": "Talegaon",
      "phone": null
    },
    {
      "id": "Bhavani",
      "name": "Bhavani",
      "center": "Talegaon",
      "phone": null
    },
    {
      "id": "Sai baba",
      "name": "Sai baba",
      "center": "Talegaon",
      "phone": null
    },
    {
      "id": "Chintamani K K",
      "name": "Chintamani K K",
      "center": "Vadad",
      "phone": null
    },
    {
      "id": "Gaurav k k",
      "name": "Gaurav k k",
      "center": "Sonora",
      "phone": null
    },
    {
      "id": "Paramsansh",
      "name": "Paramsansh",
      "center": "Shendri",
      "phone": null
    },
    {
      "id": "Ganesh A A",
      "name": "Ganesh A A",
      "center": "Kharangna Mor",
      "phone": null
    },
    {
      "id": "Jai Bajrang",
      "name": "Jai Bajrang",
      "center": "Kharangna Mor",
      "phone": null
    },
    {
      "id": "Shri Seeds",
      "name": "Shri Seeds",
      "center": "Kharangna Mor",
      "phone": null
    },
    {
      "id": "Shriram k k",
      "name": "Shriram k k",
      "center": "Karanja",
      "phone": null
    },
    {
      "id": "Agrawal k k",
      "name": "Agrawal k k",
      "center": "Karanja",
      "phone": null
    },
    {
      "id": "Venkatesh",
      "name": "Venkatesh",
      "center": "Karanja",
      "phone": null
    },
    {
      "id": "Suraj A A",
      "name": "Suraj A A",
      "center": "Karanja",
      "phone": null
    },
    {
      "id": "Ramdev kk",
      "name": "Ramdev kk",
      "center": "Waifad",
      "phone": null
    },
    {
      "id": "Jai santoshi k k",
      "name": "Jai santoshi k k",
      "center": "Waifad",
      "phone": null
    },
    {
      "id": "Vithoba KSK",
      "name": "Vithoba KSK",
      "center": "Wapgaon",
      "phone": null
    },
    {
      "id": "Vandana k k",
      "name": "Vandana k k",
      "center": "Wadgaon",
      "phone": null
    },
    {
      "id": "Atharav K k",
      "name": "Atharav K k",
      "center": "Pimpalgaon",
      "phone": null
    },
    {
      "id": "Pekaji k k",
      "name": "Pekaji k k",
      "center": "Sastabad",
      "phone": null
    },
    {
      "id": "Bhojaji",
      "name": "Bhojaji",
      "center": "Deurgaon",
      "phone": null
    },
    {
      "id": "Om k",
      "name": "Om k",
      "center": "Fatepur",
      "phone": null
    },
    {
      "id": "Meher k k",
      "name": "Meher k k",
      "center": "Rohni",
      "phone": null
    },
    {
      "id": "Sangarsh k k",
      "name": "Sangarsh k k",
      "center": "Madna",
      "phone": null
    },
    {
      "id": "Vihan",
      "name": "Vihan",
      "center": "Mansawli",
      "phone": null
    },
    {
      "id": "Jai Ambe k k",
      "name": "Jai Ambe k k",
      "center": "Sorta",
      "phone": null
    },
    {
      "id": "Krushi seva",
      "name": "Krushi seva",
      "center": "Asti",
      "phone": null
    },
    {
      "id": "Tuljai KSK",
      "name": "Tuljai KSK",
      "center": "Sukali",
      "phone": null
    },
    {
      "id": "Laxmi k mandir",
      "name": "Laxmi k mandir",
      "center": "Kosurla",
      "phone": null
    },
    {
      "id": "Shaswat k k",
      "name": "Shaswat k k",
      "center": "Sirsamudrapur",
      "phone": null
    },
    {
      "id": "Shetkari k k",
      "name": "Shetkari k k",
      "center": "Zadsi",
      "phone": null
    },
    {
      "id": "Balaji k k",
      "name": "Balaji k k",
      "center": "Vahitpur",
      "phone": null
    },
    {
      "id": "Bakane k k",
      "name": "Bakane k k",
      "center": "Sevagram",
      "phone": null
    },
    {
      "id": "Shri Ram k k",
      "name": "Shri Ram k k",
      "center": "Sevagram",
      "phone": null
    },
    {
      "id": "Shri laxmi",
      "name": "Shri laxmi",
      "center": "Sevagram",
      "phone": null
    },
    {
      "id": "Venkatsh k mac",
      "name": "Venkatsh k mac",
      "center": null,
      "phone": null
    },
    {
      "id": "Kisan Krushi",
      "name": "Kisan Krushi",
      "center": "Pipri",
      "phone": null
    },
    {
      "id": "Shri Maharudra",
      "name": "Shri Maharudra",
      "center": "Rajapur",
      "phone": null
    },
    {
      "id": "Renuka k k",
      "name": "Renuka k k",
      "center": "Salod",
      "phone": null
    },
    {
      "id": "Radhika k k",
      "name": "Radhika k k",
      "center": null,
      "phone": null
    },
    {
      "id": "Gupta kk",
      "name": "Gupta kk",
      "center": "Anji",
      "phone": null
    },
    {
      "id": "Jai Shree k k",
      "name": "Jai Shree k k",
      "center": "Arvi",
      "phone": null
    },
    {
      "id": "Prabhai k k",
      "name": "Prabhai k k",
      "center": "Bedona",
      "phone": null
    },
    {
      "id": "Sital k k",
      "name": "Sital k k",
      "center": "Bhidi",
      "phone": null
    },
    {
      "id": "Umre k k",
      "name": "Umre k k",
      "center": "Deoli",
      "phone": null
    },
    {
      "id": "Kothari Krushi",
      "name": "Kothari Krushi",
      "center": "Hinganghat",
      "phone": null
    },
    {
      "id": "Chintaman k k",
      "name": "Chintaman k k",
      "center": "Inzala",
      "phone": null
    },
    {
      "id": "Ganesh Agr",
      "name": "Ganesh Agr",
      "center": "Kharangna",
      "phone": null
    },
    {
      "id": "Laxmi k",
      "name": "Laxmi k",
      "center": "Mahakal",
      "phone": null
    },
    {
      "id": "Saraswati k kk",
      "name": "Saraswati k kk",
      "center": "Padegaon",
      "phone": null
    },
    {
      "id": "Samarth k k",
      "name": "Samarth k k",
      "center": "Pavni",
      "phone": null
    },
    {
      "id": "Taori ksk",
      "name": "Taori ksk",
      "center": "Pulgaon",
      "phone": null
    },
    {
      "id": "Kisan Agro",
      "name": "Kisan Agro",
      "center": "Pulgaon",
      "phone": null
    },
    {
      "id": "Krush Karanti",
      "name": "Krush Karanti",
      "center": "Samudrapur",
      "phone": null
    },
    {
      "id": "Shetkari Suvhidah",
      "name": "Shetkari Suvhidah",
      "center": "Sindhi",
      "phone": null
    },
    {
      "id": "Krushi Vikas",
      "name": "Krushi Vikas",
      "center": "Sindhi",
      "phone": null
    },
    {
      "id": "Vaishnavi",
      "name": "Vaishnavi",
      "center": "Taroda",
      "phone": null
    },
    {
      "id": "Gandhi k k",
      "name": "Gandhi k k",
      "center": "Wadona",
      "phone": null
    },
    {
      "id": "Karthik k k",
      "name": "Karthik k k",
      "center": "Waigaon",
      "phone": null
    },
    {
      "id": "Annadata k k",
      "name": "Annadata k k",
      "center": "Waigaon",
      "phone": null
    },
    {
      "id": "Vidharbh Krushi Kendre",
      "name": "Vidharbh Krushi Kendre",
      "center": "Wardha",
      "phone": null
    }
  ],
  "bookings": [
    {
      "partyName": "Maa Bhavani",
      "center": "Agargaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Maa Bhavani",
      "center": "Agargaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Jai Mata di",
      "center": "Alipur",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Jai Mata di",
      "center": "Alipur",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Gajanan",
      "center": "Andori",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Gajanan",
      "center": "Andori",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Shri Sai",
      "center": "Andori",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112698850,
      "totalReceived": 2500,
      "outstanding": 112696350,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Aarya K K",
      "center": "Bhankheda",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 50000,
      "rate": 3500,
      "grossBill": 175000000,
      "netPayable": 160986200,
      "totalReceived": 30000,
      "outstanding": 160956200,
      "seedName": "Unnati"
    },
    {
      "partyName": "Aarya K K",
      "center": "Bhankheda",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 70000,
      "rate": 3500,
      "grossBill": 245000000,
      "netPayable": 225386200,
      "totalReceived": 30000,
      "outstanding": 225356200,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Jai baba",
      "center": "Bhidi",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Jai baba",
      "center": "Bhidi",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Piyush k k",
      "center": "Borgaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 75000,
      "rate": 3500,
      "grossBill": 262500000,
      "netPayable": 241479300,
      "totalReceived": 45000,
      "outstanding": 241434300,
      "seedName": "Unnati"
    },
    {
      "partyName": "Piyush k k",
      "center": "Borgaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 105000,
      "rate": 3500,
      "grossBill": 367500000,
      "netPayable": 338079300,
      "totalReceived": 45000,
      "outstanding": 338034300,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Umre",
      "center": "Deoli",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 250000,
      "rate": 3500,
      "grossBill": 875000000,
      "netPayable": 804931000,
      "totalReceived": 150000,
      "outstanding": 804781000,
      "seedName": "Unnati"
    },
    {
      "partyName": "Umre",
      "center": "Deoli",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 350000,
      "rate": 3500,
      "grossBill": 1225000000,
      "netPayable": 1126931000,
      "totalReceived": 150000,
      "outstanding": 1126781000,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Badnore A",
      "center": "Deoli",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 125000,
      "rate": 3500,
      "grossBill": 437500000,
      "netPayable": 402465500,
      "totalReceived": 75000,
      "outstanding": 402390500,
      "seedName": "Unnati"
    },
    {
      "partyName": "Badnore A",
      "center": "Deoli",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 175000,
      "rate": 3500,
      "grossBill": 612500000,
      "netPayable": 563465500,
      "totalReceived": 75000,
      "outstanding": 563390500,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Sagar k k",
      "center": "Deoli",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 12500,
      "rate": 3500,
      "grossBill": 43750000,
      "netPayable": 40246550,
      "totalReceived": 15000,
      "outstanding": 40231550,
      "seedName": "Unnati"
    },
    {
      "partyName": "Sagar k k",
      "center": "Deoli",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 17500,
      "rate": 3500,
      "grossBill": 61250000,
      "netPayable": 56346550,
      "totalReceived": 15000,
      "outstanding": 56331550,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Arade",
      "center": "Deoli",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 20150,
      "outstanding": 80472950,
      "seedName": "Unnati"
    },
    {
      "partyName": "Arade",
      "center": "Deoli",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 20150,
      "outstanding": 112672950,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Shri krushi vikas",
      "center": "Deoli",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 15000,
      "outstanding": 80478100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Shri krushi vikas",
      "center": "Deoli",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 15000,
      "outstanding": 112678100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Krushi Mitra",
      "center": "Deoli",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 15000,
      "outstanding": -15000,
      "seedName": "Unnati"
    },
    {
      "partyName": "Krushi Mitra",
      "center": "Deoli",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 15000,
      "outstanding": -15000,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Sidhi K k",
      "center": "Deoli",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 125000,
      "rate": 3500,
      "grossBill": 437500000,
      "netPayable": 402465500,
      "totalReceived": 75000,
      "outstanding": 402390500,
      "seedName": "Unnati"
    },
    {
      "partyName": "Sidhi K k",
      "center": "Deoli",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 175000,
      "rate": 3500,
      "grossBill": 612500000,
      "netPayable": 563465500,
      "totalReceived": 75000,
      "outstanding": 563390500,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Krushi Suvidha",
      "center": "Deoli",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 375000,
      "rate": 3500,
      "grossBill": 1312500000,
      "netPayable": 1207408000,
      "totalReceived": 200000,
      "outstanding": 1207208000,
      "seedName": "Unnati"
    },
    {
      "partyName": "Krushi Suvidha",
      "center": "Deoli",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 175000,
      "rate": 3500,
      "grossBill": 612500000,
      "netPayable": 563408000,
      "totalReceived": 200000,
      "outstanding": 563208000,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Pratik K K",
      "center": "Dhegaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 75000,
      "rate": 3500,
      "grossBill": 262500000,
      "netPayable": 241479300,
      "totalReceived": 45000,
      "outstanding": 241434300,
      "seedName": "Unnati"
    },
    {
      "partyName": "Pratik K K",
      "center": "Dhegaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 105000,
      "rate": 3500,
      "grossBill": 367500000,
      "netPayable": 338079300,
      "totalReceived": 45000,
      "outstanding": 338034300,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Sachin k k",
      "center": "Girad",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Sachin k k",
      "center": "Girad",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Gajanan Maharaj",
      "center": "Girad",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Gajanan Maharaj",
      "center": "Girad",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Vidharbh",
      "center": "Girad",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Vidharbh",
      "center": "Girad",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Kisan Mauli",
      "center": "Girad",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 15000,
      "outstanding": 80478100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Kisan Mauli",
      "center": "Girad",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 15000,
      "outstanding": 112678100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Ahish K K",
      "center": "Girad",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Ahish K K",
      "center": "Girad",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Mangal Murti",
      "center": "Ghorad",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Mangal Murti",
      "center": "Ghorad",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Shiv Krupa",
      "center": "Ghorad",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 15000,
      "outstanding": 80478100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Shiv Krupa",
      "center": "Ghorad",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 15000,
      "outstanding": 112678100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Shende k k",
      "center": "Hamdapur",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 30000,
      "outstanding": 80463100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Shende k k",
      "center": "Hamdapur",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 30000,
      "outstanding": 112663100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Shriram k k",
      "center": "Hamdapur",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80488500,
      "totalReceived": 25000,
      "outstanding": 80463500,
      "seedName": "Unnati"
    },
    {
      "partyName": "Shriram k k",
      "center": "Hamdapur",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 175000,
      "rate": 3500,
      "grossBill": 612500000,
      "netPayable": 563488500,
      "totalReceived": 25000,
      "outstanding": 563463500,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Krushi seva",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Krushi seva",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Kothari k k",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 50000,
      "rate": 3500,
      "grossBill": 175000000,
      "netPayable": 160986200,
      "totalReceived": 30000,
      "outstanding": 160956200,
      "seedName": "Unnati"
    },
    {
      "partyName": "Kothari k k",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 70000,
      "rate": 3500,
      "grossBill": 245000000,
      "netPayable": 225386200,
      "totalReceived": 30000,
      "outstanding": 225356200,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Abhay seeds",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Abhay seeds",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Samrudhi",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Samrudhi",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Kochar Biyane",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Kochar Biyane",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Balpande k k",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Balpande k k",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Sachin k k",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Sachin k k",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Badiraja k k",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Badiraja k k",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Rajendra k k",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Rajendra k k",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Deotale",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Deotale",
      "center": "Hinganghat",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Mahalaxmi k k",
      "center": "Inzala",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 50000,
      "rate": 3500,
      "grossBill": 175000000,
      "netPayable": 160985050,
      "totalReceived": 87500,
      "outstanding": 160897550,
      "seedName": "Unnati"
    },
    {
      "partyName": "Mahalaxmi k k",
      "center": "Inzala",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 105000,
      "rate": 3500,
      "grossBill": 367500000,
      "netPayable": 338085050,
      "totalReceived": 87500,
      "outstanding": 337997550,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Priya k k",
      "center": "Nachangaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 50000,
      "rate": 3500,
      "grossBill": 175000000,
      "netPayable": 160986200,
      "totalReceived": 30000,
      "outstanding": 160956200,
      "seedName": "Unnati"
    },
    {
      "partyName": "Priya k k",
      "center": "Nachangaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 70000,
      "rate": 3500,
      "grossBill": 245000000,
      "netPayable": 225386200,
      "totalReceived": 30000,
      "outstanding": 225356200,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Anand Traders",
      "center": "Kelzar",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 20000,
      "outstanding": 80473100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Anand Traders",
      "center": "Kelzar",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 20000,
      "outstanding": 112673100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Sidhi Vinayak",
      "center": "Kelzar",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Sidhi Vinayak",
      "center": "Kelzar",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Jagdamb k k",
      "center": "Kora",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 125000,
      "rate": 3500,
      "grossBill": 437500000,
      "netPayable": 402465500,
      "totalReceived": 75000,
      "outstanding": 402390500,
      "seedName": "Unnati"
    },
    {
      "partyName": "Jagdamb k k",
      "center": "Kora",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 175000,
      "rate": 3500,
      "grossBill": 612500000,
      "netPayable": 563465500,
      "totalReceived": 75000,
      "outstanding": 563390500,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Amruta k k",
      "center": "Kora",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Amruta k k",
      "center": "Kora",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Pragati k k",
      "center": "Kora",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 15000,
      "outstanding": 80478100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Pragati k k",
      "center": "Kora",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 15000,
      "outstanding": 112678100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Adarsh k k",
      "center": "Kora",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 150000,
      "rate": 3500,
      "grossBill": 525000000,
      "netPayable": 482958600,
      "totalReceived": 90000,
      "outstanding": 482868600,
      "seedName": "Unnati"
    },
    {
      "partyName": "Adarsh k k",
      "center": "Kora",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 210000,
      "rate": 3500,
      "grossBill": 735000000,
      "netPayable": 676158600,
      "totalReceived": 90000,
      "outstanding": 676068600,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Nagdi k k",
      "center": "Kora",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 50000,
      "rate": 3500,
      "grossBill": 175000000,
      "netPayable": 160986200,
      "totalReceived": 40000,
      "outstanding": 160946200,
      "seedName": "Unnati"
    },
    {
      "partyName": "Nagdi k k",
      "center": "Kora",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 70000,
      "rate": 3500,
      "grossBill": 245000000,
      "netPayable": 225386200,
      "totalReceived": 40000,
      "outstanding": 225346200,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Shri Ganesh",
      "center": "Kora",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 175000,
      "rate": 3500,
      "grossBill": 612500000,
      "netPayable": 563454000,
      "totalReceived": 100000,
      "outstanding": 563354000,
      "seedName": "Unnati"
    },
    {
      "partyName": "Shri Ganesh",
      "center": "Kora",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 175000,
      "rate": 3500,
      "grossBill": 612500000,
      "netPayable": 563454000,
      "totalReceived": 100000,
      "outstanding": 563354000,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Ayush k k",
      "center": "Kora",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 50000,
      "rate": 3500,
      "grossBill": 175000000,
      "netPayable": 160988500,
      "totalReceived": 25000,
      "outstanding": 160963500,
      "seedName": "Unnati"
    },
    {
      "partyName": "Bhandakkar",
      "center": "Kora",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 15000,
      "outstanding": 80478100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Bhandakkar",
      "center": "Kora",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 15000,
      "outstanding": 112678100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Laxmi k k",
      "center": "Mahakal",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 12500,
      "rate": 3500,
      "grossBill": 43750000,
      "netPayable": 40245975,
      "totalReceived": 53750,
      "outstanding": 40192225,
      "seedName": "Unnati"
    },
    {
      "partyName": "Laxmi k k",
      "center": "Mahakal",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112695975,
      "totalReceived": 53750,
      "outstanding": 112642225,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Mahesh K K",
      "center": "Mandgaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Mahesh K K",
      "center": "Mandgaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Bharat k k",
      "center": "Mandgaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 15000,
      "outstanding": 80478100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Bharat k k",
      "center": "Mandgaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 15000,
      "outstanding": 112678100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Sahil",
      "center": "Mandgaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 125000,
      "rate": 3500,
      "grossBill": 437500000,
      "netPayable": 402465500,
      "totalReceived": 66500,
      "outstanding": 402399000,
      "seedName": "Unnati"
    },
    {
      "partyName": "Sahil",
      "center": "Mandgaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 175000,
      "rate": 3500,
      "grossBill": 612500000,
      "netPayable": 563465500,
      "totalReceived": 66500,
      "outstanding": 563399000,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Sai k k",
      "center": "Nandori",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 15000,
      "outstanding": 80478100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Sai k k",
      "center": "Nandori",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 15000,
      "outstanding": 112678100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Taori K  k",
      "center": "Pulgaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 750000,
      "rate": 3500,
      "grossBill": 2625000000,
      "netPayable": 2414804500,
      "totalReceived": 425000,
      "outstanding": 2414379500,
      "seedName": "Unnati"
    },
    {
      "partyName": "Taori K  k",
      "center": "Pulgaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 700000,
      "rate": 3500,
      "grossBill": 2450000000,
      "netPayable": 2253804500,
      "totalReceived": 425000,
      "outstanding": 2253379500,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Dhamiya k k",
      "center": "Pulgaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 75000,
      "rate": 3500,
      "grossBill": 262500000,
      "netPayable": 241479300,
      "totalReceived": 45000,
      "outstanding": 241434300,
      "seedName": "Unnati"
    },
    {
      "partyName": "Dhamiya k k",
      "center": "Pulgaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 105000,
      "rate": 3500,
      "grossBill": 367500000,
      "netPayable": 338079300,
      "totalReceived": 45000,
      "outstanding": 338034300,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Kisan A A",
      "center": "Pulgaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 75000,
      "rate": 3500,
      "grossBill": 262500000,
      "netPayable": 241479300,
      "totalReceived": 45000,
      "outstanding": 241434300,
      "seedName": "Unnati"
    },
    {
      "partyName": "Kisan A A",
      "center": "Pulgaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 105000,
      "rate": 3500,
      "grossBill": 367500000,
      "netPayable": 338079300,
      "totalReceived": 45000,
      "outstanding": 338034300,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Chintamani K K",
      "center": "Pulgaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 15000,
      "outstanding": -15000,
      "seedName": "Unnati"
    },
    {
      "partyName": "Chintamani K K",
      "center": "Pulgaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 15000,
      "outstanding": -15000,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Saibaba K k",
      "center": "Pulgaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Saibaba K k",
      "center": "Pulgaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Priya fertilizers",
      "center": "Pulgaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Priya fertilizers",
      "center": "Pulgaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Shree Ram K K",
      "center": "Samudrapur",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 125000,
      "rate": 3500,
      "grossBill": 437500000,
      "netPayable": 402465500,
      "totalReceived": 75000,
      "outstanding": 402390500,
      "seedName": "Unnati"
    },
    {
      "partyName": "Shree Ram K K",
      "center": "Samudrapur",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 175000,
      "rate": 3500,
      "grossBill": 612500000,
      "netPayable": 563465500,
      "totalReceived": 75000,
      "outstanding": 563390500,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Krishi Kranti",
      "center": "Samudrapur",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Krishi Kranti",
      "center": "Samudrapur",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Jain Traders",
      "center": "Samudrapur",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Jain Traders",
      "center": "Samudrapur",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Kastakar k k",
      "center": "Samudrapur",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Kastakar k k",
      "center": "Samudrapur",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Zade k k",
      "center": "Samudrapur",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 15000,
      "outstanding": 80478100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Zade k k",
      "center": "Samudrapur",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 15000,
      "outstanding": 112678100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Gurudeo k k",
      "center": "Samudrapur",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Gurudeo k k",
      "center": "Samudrapur",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Agrawal k k",
      "center": "Samudrapur",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Agrawal k k",
      "center": "Samudrapur",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Ande k k",
      "center": "Samudrapur",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 15000,
      "outstanding": 80478100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Ande k k",
      "center": "Samudrapur",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 15000,
      "outstanding": 112678100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Krushi mitra",
      "center": "Selu",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 15000,
      "outstanding": 80478100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Krushi mitra",
      "center": "Selu",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 15000,
      "outstanding": 112678100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Parag K k",
      "center": "Selu",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 15000,
      "outstanding": 80478100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Parag K k",
      "center": "Selu",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 15000,
      "outstanding": 112678100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Jai Bajrang",
      "center": "Selu",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 50000,
      "rate": 3500,
      "grossBill": 175000000,
      "netPayable": 160986200,
      "totalReceived": 30000,
      "outstanding": 160956200,
      "seedName": "Unnati"
    },
    {
      "partyName": "Jai Bajrang",
      "center": "Selu",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 70000,
      "rate": 3500,
      "grossBill": 245000000,
      "netPayable": 225386200,
      "totalReceived": 30000,
      "outstanding": 225356200,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Radha k k",
      "center": "Selu",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 15000,
      "outstanding": 80478100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Radha k k",
      "center": "Selu",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 15000,
      "outstanding": 112678100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Dhanashri",
      "center": "Selu",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Dhanashri",
      "center": "Selu",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Jailaxmi K K",
      "center": "Selu",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 50000,
      "rate": 3500,
      "grossBill": 175000000,
      "netPayable": 160986200,
      "totalReceived": 10000,
      "outstanding": 160976200,
      "seedName": "Unnati"
    },
    {
      "partyName": "Jailaxmi K K",
      "center": "Selu",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 70000,
      "rate": 3500,
      "grossBill": 245000000,
      "netPayable": 225386200,
      "totalReceived": 10000,
      "outstanding": 225376200,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Gurukrupa Organic",
      "center": "Selu",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Gurukrupa Organic",
      "center": "Selu",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Bhushan k k",
      "center": "Sindhi Rly",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 100000,
      "rate": 3500,
      "grossBill": 350000000,
      "netPayable": 321972400,
      "totalReceived": 60000,
      "outstanding": 321912400,
      "seedName": "Unnati"
    },
    {
      "partyName": "Bhushan k k",
      "center": "Sindhi Rly",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 140000,
      "rate": 3500,
      "grossBill": 490000000,
      "netPayable": 450772400,
      "totalReceived": 60000,
      "outstanding": 450712400,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Shetmauli k k",
      "center": "Sindhi Rly",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 70000,
      "rate": 3500,
      "grossBill": 245000000,
      "netPayable": 225397700,
      "totalReceived": 5000,
      "outstanding": 225392700,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Venkatesh",
      "center": "Sindhi Rly",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Venkatesh",
      "center": "Sindhi Rly",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Jaikisan",
      "center": "Sindhi Rly",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 70000,
      "rate": 3500,
      "grossBill": 245000000,
      "netPayable": 225397700,
      "totalReceived": 5000,
      "outstanding": 225392700,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Kisan Tr Co",
      "center": "Sindhi Rly",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 75000,
      "rate": 3500,
      "grossBill": 262500000,
      "netPayable": 241479300,
      "totalReceived": 45000,
      "outstanding": 241434300,
      "seedName": "Unnati"
    },
    {
      "partyName": "Kisan Tr Co",
      "center": "Sindhi Rly",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 105000,
      "rate": 3500,
      "grossBill": 367500000,
      "netPayable": 338079300,
      "totalReceived": 45000,
      "outstanding": 338034300,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Shetkari Suvhidha",
      "center": "Sindhi Rly",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 75000,
      "rate": 3500,
      "grossBill": 262500000,
      "netPayable": 241479300,
      "totalReceived": 45000,
      "outstanding": 241434300,
      "seedName": "Unnati"
    },
    {
      "partyName": "Shetkari Suvhidha",
      "center": "Sindhi Rly",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 105000,
      "rate": 3500,
      "grossBill": 367500000,
      "netPayable": 338079300,
      "totalReceived": 45000,
      "outstanding": 338034300,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Rutika k k",
      "center": "Talni",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Rutika k k",
      "center": "Talni",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Jai Jagannath",
      "center": "Vashi",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Jai Jagannath",
      "center": "Vashi",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Kartik k k",
      "center": "Waigaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Kartik k k",
      "center": "Waigaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Nagrale k k",
      "center": "Waigaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 15000,
      "outstanding": 80478100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Nagrale k k",
      "center": "Waigaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 15000,
      "outstanding": 112678100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Laxmi k k",
      "center": "Waigaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 75000,
      "rate": 3500,
      "grossBill": 262500000,
      "netPayable": 241479300,
      "totalReceived": 53750,
      "outstanding": 241425550,
      "seedName": "Unnati"
    },
    {
      "partyName": "Laxmi k k",
      "center": "Waigaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 105000,
      "rate": 3500,
      "grossBill": 367500000,
      "netPayable": 338079300,
      "totalReceived": 53750,
      "outstanding": 338025550,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Annadata kk",
      "center": "Waigaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Annadata kk",
      "center": "Waigaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Pawan k Mandir",
      "center": "Waigaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 625000,
      "rate": 3500,
      "grossBill": 2187500000,
      "netPayable": 2012344750,
      "totalReceived": 174000,
      "outstanding": 2012170750,
      "seedName": "Unnati"
    },
    {
      "partyName": "Pawan k Mandir",
      "center": "Waigaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 350000,
      "rate": 3500,
      "grossBill": 1225000000,
      "netPayable": 1126844750,
      "totalReceived": 174000,
      "outstanding": 1126670750,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Om krushi mandir",
      "center": "Waigaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 12500,
      "rate": 3500,
      "grossBill": 43750000,
      "netPayable": 40246550,
      "totalReceived": 30000,
      "outstanding": 40216550,
      "seedName": "Unnati"
    },
    {
      "partyName": "Om krushi mandir",
      "center": "Waigaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 17500,
      "rate": 3500,
      "grossBill": 61250000,
      "netPayable": 56346550,
      "totalReceived": 30000,
      "outstanding": 56316550,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Jagdamba K K",
      "center": "Waigaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 250000,
      "rate": 3500,
      "grossBill": 875000000,
      "netPayable": 804940200,
      "totalReceived": 130000,
      "outstanding": 804810200,
      "seedName": "Unnati"
    },
    {
      "partyName": "Jagdamba K K",
      "center": "Waigaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 70000,
      "rate": 3500,
      "grossBill": 245000000,
      "netPayable": 225340200,
      "totalReceived": 130000,
      "outstanding": 225210200,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Sethkari K K",
      "center": "Waigaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Sethkari K K",
      "center": "Waigaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Dhartidhan",
      "center": "Wardha",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 125000,
      "rate": 3500,
      "grossBill": 437500000,
      "netPayable": 402465500,
      "totalReceived": 75000,
      "outstanding": 402390500,
      "seedName": "Unnati"
    },
    {
      "partyName": "Dhartidhan",
      "center": "Wardha",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 175000,
      "rate": 3500,
      "grossBill": 612500000,
      "netPayable": 563465500,
      "totalReceived": 75000,
      "outstanding": 563390500,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Shri Seeds",
      "center": "Wardha",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Shri Seeds",
      "center": "Wardha",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Kothari k k",
      "center": "Wardha",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 30000,
      "outstanding": -30000,
      "seedName": "Unnati"
    },
    {
      "partyName": "Kothari k k",
      "center": "Wardha",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 30000,
      "outstanding": -30000,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Badnore Agro",
      "center": "Wardha",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 75000,
      "rate": 3500,
      "grossBill": 262500000,
      "netPayable": 241477000,
      "totalReceived": 50000,
      "outstanding": 241427000,
      "seedName": "Unnati"
    },
    {
      "partyName": "Badnore Agro",
      "center": "Wardha",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 175000,
      "rate": 3500,
      "grossBill": 612500000,
      "netPayable": 563477000,
      "totalReceived": 50000,
      "outstanding": 563427000,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Chandak A Cen",
      "center": "Wardha",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Chandak A Cen",
      "center": "Wardha",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Chandak Traders",
      "center": "Wardha",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Chandak Traders",
      "center": "Wardha",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Gayatri Ramnagar",
      "center": "Wardha",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Gayatri Ramnagar",
      "center": "Wardha",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Rathi Traders",
      "center": "Wardha",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 75000,
      "rate": 3500,
      "grossBill": 262500000,
      "netPayable": 241479300,
      "totalReceived": 45000,
      "outstanding": 241434300,
      "seedName": "Unnati"
    },
    {
      "partyName": "Rathi Traders",
      "center": "Wardha",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 105000,
      "rate": 3500,
      "grossBill": 367500000,
      "netPayable": 338079300,
      "totalReceived": 45000,
      "outstanding": 338034300,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Gupta",
      "center": "Anji",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Gupta",
      "center": "Anji",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Shri Agro",
      "center": "Anji",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Shri Agro",
      "center": "Anji",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Kejaji A Traders",
      "center": "Taroda",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 25000,
      "outstanding": -25000,
      "seedName": "Unnati"
    },
    {
      "partyName": "Kejaji A Traders",
      "center": "Taroda",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 25000,
      "outstanding": -25000,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Kunal A A",
      "center": "Taroda",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 45000,
      "outstanding": -45000,
      "seedName": "Unnati"
    },
    {
      "partyName": "Kunal A A",
      "center": "Taroda",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 45000,
      "outstanding": -45000,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Shri Venkatesh",
      "center": "Taroda",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Shri Venkatesh",
      "center": "Taroda",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Satvik k k",
      "center": "Salod",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Satvik k k",
      "center": "Salod",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Renuka",
      "center": "Salod",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Renuka",
      "center": "Salod",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "KISANHELP AGRO",
      "center": "Salod",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 30000,
      "outstanding": -30000,
      "seedName": "Unnati"
    },
    {
      "partyName": "KISANHELP AGRO",
      "center": "Salod",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 30000,
      "outstanding": -30000,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Tulza Bhavani k k",
      "center": "Pailanpur",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 15000,
      "outstanding": -15000,
      "seedName": "Unnati"
    },
    {
      "partyName": "Tulza Bhavani k k",
      "center": "Pailanpur",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 15000,
      "outstanding": -15000,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Vikaram KSK",
      "center": "Vijay Gopal",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 15000,
      "outstanding": 80478100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Vikaram KSK",
      "center": "Vijay Gopal",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 15000,
      "outstanding": 112678100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Uday k k",
      "center": "Sirasgaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 15000,
      "outstanding": 80478100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Uday k k",
      "center": "Sirasgaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 15000,
      "outstanding": 112678100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Pratik A A",
      "center": "Jaipur",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 70000,
      "rate": 3500,
      "grossBill": 245000000,
      "netPayable": 225397700,
      "totalReceived": 5000,
      "outstanding": 225392700,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Mende",
      "center": "Whagholi",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Mende",
      "center": "Whagholi",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Sant Gajanan",
      "center": "Whagholi",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Sant Gajanan",
      "center": "Whagholi",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Matrubhumi",
      "center": "Whagholi",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 32500,
      "rate": 3500,
      "grossBill": 113750000,
      "netPayable": 104640800,
      "totalReceived": 20000,
      "outstanding": 104620800,
      "seedName": "Unnati"
    },
    {
      "partyName": "Matrubhumi",
      "center": "Whagholi",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 52500,
      "rate": 3500,
      "grossBill": 183750000,
      "netPayable": 169040800,
      "totalReceived": 20000,
      "outstanding": 169020800,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Shri Krushna",
      "center": "Asta",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Shri Krushna",
      "center": "Asta",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Om krushi kendre",
      "center": "Giroli",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 50000,
      "rate": 3500,
      "grossBill": 175000000,
      "netPayable": 160986200,
      "totalReceived": 30000,
      "outstanding": 160956200,
      "seedName": "Unnati"
    },
    {
      "partyName": "Om krushi kendre",
      "center": "Giroli",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 70000,
      "rate": 3500,
      "grossBill": 245000000,
      "netPayable": 225386200,
      "totalReceived": 30000,
      "outstanding": 225356200,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Hore k k",
      "center": "ShirPur",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 15000,
      "outstanding": 80478100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Hore k k",
      "center": "ShirPur",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 15000,
      "outstanding": 112678100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Samarth",
      "center": "Pawni",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Samarth",
      "center": "Pawni",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Shetkari k k",
      "center": "Whaghala",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Shetkari k k",
      "center": "Whaghala",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Shetmauli",
      "center": "Inzapur",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Shetmauli",
      "center": "Inzapur",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Pragati kk",
      "center": "Sukali Station",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Pragati kk",
      "center": "Sukali Station",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Swami samarth",
      "center": "Yelakeli",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Swami samarth",
      "center": "Yelakeli",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Lonkar k k",
      "center": "Wela",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 40000,
      "rate": 3500,
      "grossBill": 140000000,
      "netPayable": 128788500,
      "totalReceived": 25000,
      "outstanding": 128763500,
      "seedName": "Unnati"
    },
    {
      "partyName": "Lonkar k k",
      "center": "Wela",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 70000,
      "rate": 3500,
      "grossBill": 245000000,
      "netPayable": 225388500,
      "totalReceived": 25000,
      "outstanding": 225363500,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Shradha",
      "center": "Wela",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Shradha",
      "center": "Wela",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Chandak A Cen",
      "center": "Arvi",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Chandak A Cen",
      "center": "Arvi",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Jaishree K k",
      "center": "Arvi",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 250000,
      "rate": 3500,
      "grossBill": 875000000,
      "netPayable": 804936750,
      "totalReceived": 137500,
      "outstanding": 804799250,
      "seedName": "Unnati"
    },
    {
      "partyName": "Jaishree K k",
      "center": "Arvi",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 175000,
      "rate": 3500,
      "grossBill": 612500000,
      "netPayable": 563436750,
      "totalReceived": 137500,
      "outstanding": 563299250,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Mahalaxmi k k",
      "center": "Kharangna Gode",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 15000,
      "rate": 3500,
      "grossBill": 52500000,
      "netPayable": 48295400,
      "totalReceived": 87500,
      "outstanding": 48207900,
      "seedName": "Unnati"
    },
    {
      "partyName": "Mahalaxmi k k",
      "center": "Kharangna Gode",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112695400,
      "totalReceived": 87500,
      "outstanding": 112607900,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Tulza Bhavani k k",
      "center": "Wadona",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 15000,
      "outstanding": 80478100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Tulza Bhavani k k",
      "center": "Wadona",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 15000,
      "outstanding": 112678100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Om Sai",
      "center": "Wadona",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Om Sai",
      "center": "Wadona",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Krushna k k",
      "center": "Talegaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Krushna k k",
      "center": "Talegaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Bhavani",
      "center": "Talegaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Bhavani",
      "center": "Talegaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Sai baba",
      "center": "Talegaon",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": null,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Sai baba",
      "center": "Talegaon",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": null,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Chintamani K K",
      "center": "Vadad",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 25000,
      "rate": 3500,
      "grossBill": 87500000,
      "netPayable": 80493100,
      "totalReceived": 15000,
      "outstanding": 80478100,
      "seedName": "Unnati"
    },
    {
      "partyName": "Chintamani K K",
      "center": "Vadad",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 35000,
      "rate": 3500,
      "grossBill": 122500000,
      "netPayable": 112693100,
      "totalReceived": 15000,
      "outstanding": 112678100,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Gaurav k k",
      "center": "Sonora",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 70000,
      "rate": 3500,
      "grossBill": 245000000,
      "netPayable": 225397700,
      "totalReceived": 5000,
      "outstanding": 225392700,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Paramsansh",
      "center": "Shendri",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Paramsansh",
      "center": "Shendri",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Ganesh A A",
      "center": "Kharangna Mor",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Ganesh A A",
      "center": "Kharangna Mor",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Jai Bajrang",
      "center": "Kharangna Mor",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 30000,
      "outstanding": -30000,
      "seedName": "Unnati"
    },
    {
      "partyName": "Jai Bajrang",
      "center": "Kharangna Mor",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 30000,
      "outstanding": -30000,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Jai Ambe k k",
      "center": "Sorta",
      "companyId": "CO01",
      "seedId": "S001",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Unnati"
    },
    {
      "partyName": "Jai Ambe k k",
      "center": "Sorta",
      "companyId": "CO01",
      "seedId": "S002",
      "bagsFinal": 0,
      "rate": 3500,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Samrudhi"
    },
    {
      "partyName": "Sai k k",
      "center": "Bhankheda",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 40,
      "rate": 2999,
      "grossBill": 119960,
      "netPayable": 108063,
      "totalReceived": 25000,
      "outstanding": 83063,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Sai k k",
      "center": "Bhankheda",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 20,
      "rate": 3199,
      "grossBill": 63980,
      "netPayable": 56562,
      "totalReceived": 25000,
      "outstanding": 31562,
      "seedName": "Avantika"
    },
    {
      "partyName": "Meher Baba",
      "center": "Bhankheda",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 64,
      "rate": 2999,
      "grossBill": 191936,
      "netPayable": 171981,
      "totalReceived": 50000,
      "outstanding": 121981,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Badnore A",
      "center": "Deoli",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 30,
      "rate": 2999,
      "grossBill": 89970,
      "netPayable": 80472,
      "totalReceived": 25000,
      "outstanding": 55472,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Badnore A",
      "center": "Deoli",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 0,
      "rate": 3199,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 25000,
      "outstanding": -25000,
      "seedName": "Avantika"
    },
    {
      "partyName": "Gajanan",
      "center": "Deoli",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 40,
      "rate": 2999,
      "grossBill": 119960,
      "netPayable": 108063,
      "totalReceived": 25000,
      "outstanding": 83063,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Gajanan",
      "center": "Deoli",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 25,
      "rate": 3199,
      "grossBill": 79975,
      "netPayable": 71277,
      "totalReceived": 25000,
      "outstanding": 46277,
      "seedName": "Avantika"
    },
    {
      "partyName": "Sidhi K k",
      "center": "Deoli",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 30,
      "rate": 2999,
      "grossBill": 89970,
      "netPayable": 80472,
      "totalReceived": 25000,
      "outstanding": 55472,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Pratik K K",
      "center": "Dhegaon",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 50,
      "rate": 2999,
      "grossBill": 149950,
      "netPayable": 135654,
      "totalReceived": 25000,
      "outstanding": 110654,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Pratik K K",
      "center": "Dhegaon",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 50,
      "rate": 3199,
      "grossBill": 159950,
      "netPayable": 144854,
      "totalReceived": 25000,
      "outstanding": 119854,
      "seedName": "Avantika"
    },
    {
      "partyName": "Sachin k k",
      "center": "Girad",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 80,
      "rate": 2999,
      "grossBill": 239920,
      "netPayable": 218426,
      "totalReceived": 75000,
      "outstanding": 143426,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Sachin k k",
      "center": "Girad",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 20,
      "rate": 3199,
      "grossBill": 63980,
      "netPayable": 56562,
      "totalReceived": 75000,
      "outstanding": -18438,
      "seedName": "Avantika"
    },
    {
      "partyName": "Jai Kisan k k",
      "center": "Girad",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 50,
      "rate": 2999,
      "grossBill": 149950,
      "netPayable": 135654,
      "totalReceived": 25000,
      "outstanding": 110654,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Ahish K K",
      "center": "Girad",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 50,
      "rate": 2999,
      "grossBill": 149950,
      "netPayable": 135654,
      "totalReceived": 25000,
      "outstanding": 110654,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Abhay seeds",
      "center": "Hinganghat",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 150,
      "rate": 2999,
      "grossBill": 449850,
      "netPayable": 402362,
      "totalReceived": 125000,
      "outstanding": 277362,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Abhay seeds",
      "center": "Hinganghat",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 100,
      "rate": 3199,
      "grossBill": 319900,
      "netPayable": 282808,
      "totalReceived": 125000,
      "outstanding": 157808,
      "seedName": "Avantika"
    },
    {
      "partyName": "Krushi Seva",
      "center": "Hinganghat",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 80,
      "rate": 2999,
      "grossBill": 239920,
      "netPayable": 216126,
      "totalReceived": 50000,
      "outstanding": 166126,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Krushi Seva",
      "center": "Hinganghat",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 50,
      "rate": 3199,
      "grossBill": 159950,
      "netPayable": 142554,
      "totalReceived": 50000,
      "outstanding": 92554,
      "seedName": "Avantika"
    },
    {
      "partyName": "Sachin k k",
      "center": "Hinganghat",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 100,
      "rate": 2999,
      "grossBill": 299900,
      "netPayable": 271308,
      "totalReceived": 75000,
      "outstanding": 196308,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Sachin k k",
      "center": "Hinganghat",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 100,
      "rate": 3199,
      "grossBill": 319900,
      "netPayable": 289708,
      "totalReceived": 75000,
      "outstanding": 214708,
      "seedName": "Avantika"
    },
    {
      "partyName": "Anand Traders",
      "center": "Kelzar",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 50,
      "rate": 2999,
      "grossBill": 149950,
      "netPayable": 133354,
      "totalReceived": 50000,
      "outstanding": 83354,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Anand Traders",
      "center": "Kelzar",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 10,
      "rate": 3199,
      "grossBill": 31990,
      "netPayable": 24831,
      "totalReceived": 50000,
      "outstanding": -25169,
      "seedName": "Avantika"
    },
    {
      "partyName": "Adarsh k k",
      "center": "Kora",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 125,
      "rate": 2999,
      "grossBill": 374875,
      "netPayable": 335685,
      "totalReceived": 100000,
      "outstanding": 235685,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Adarsh k k",
      "center": "Kora",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 125,
      "rate": 3199,
      "grossBill": 399875,
      "netPayable": 358685,
      "totalReceived": 100000,
      "outstanding": 258685,
      "seedName": "Avantika"
    },
    {
      "partyName": "Nagdi k k",
      "center": "Kora",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 75,
      "rate": 2999,
      "grossBill": 224925,
      "netPayable": 204631,
      "totalReceived": 25000,
      "outstanding": 179631,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Nagdi k k",
      "center": "Kora",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 25,
      "rate": 3199,
      "grossBill": 79975,
      "netPayable": 71277,
      "totalReceived": 25000,
      "outstanding": 46277,
      "seedName": "Avantika"
    },
    {
      "partyName": "Shri Ganesh",
      "center": "Kora",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 100,
      "rate": 2999,
      "grossBill": 299900,
      "netPayable": 273608,
      "totalReceived": 25000,
      "outstanding": 248608,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Ayush k k",
      "center": "Kora",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 0,
      "rate": 2999,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 25000,
      "outstanding": -25000,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Ayush k k",
      "center": "Kora",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 50,
      "rate": 3199,
      "grossBill": 159950,
      "netPayable": 144854,
      "totalReceived": 25000,
      "outstanding": 119854,
      "seedName": "Avantika"
    },
    {
      "partyName": "Mahesh K K",
      "center": "Mandgaon",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 250,
      "rate": 2999,
      "grossBill": 749750,
      "netPayable": 678270,
      "totalReceived": 125000,
      "outstanding": 553270,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Mahesh K K",
      "center": "Mandgaon",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 10,
      "rate": 3199,
      "grossBill": 31990,
      "netPayable": 17931,
      "totalReceived": 125000,
      "outstanding": -107069,
      "seedName": "Avantika"
    },
    {
      "partyName": "Taori K  k",
      "center": "Pulgaon",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 0,
      "rate": 2999,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 150000,
      "outstanding": -150000,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Taori K  k",
      "center": "Pulgaon",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 70,
      "rate": 3199,
      "grossBill": 223930,
      "netPayable": 192216,
      "totalReceived": 150000,
      "outstanding": 42216,
      "seedName": "Avantika"
    },
    {
      "partyName": "Jaiswal k k",
      "center": "Rehki",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 25,
      "rate": 2999,
      "grossBill": 74975,
      "netPayable": 66677,
      "totalReceived": 25000,
      "outstanding": 41677,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Jaiswal k k",
      "center": "Rehki",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 25,
      "rate": 3199,
      "grossBill": 79975,
      "netPayable": 71277,
      "totalReceived": 25000,
      "outstanding": 46277,
      "seedName": "Avantika"
    },
    {
      "partyName": "Zade k k",
      "center": "Samudrapur",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 25,
      "rate": 2999,
      "grossBill": 74975,
      "netPayable": 66677,
      "totalReceived": 25000,
      "outstanding": 41677,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Zade k k",
      "center": "Samudrapur",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 25,
      "rate": 3199,
      "grossBill": 79975,
      "netPayable": 71277,
      "totalReceived": 25000,
      "outstanding": 46277,
      "seedName": "Avantika"
    },
    {
      "partyName": "Krushi mitra",
      "center": "Selu",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 50,
      "rate": 2999,
      "grossBill": 149950,
      "netPayable": 135654,
      "totalReceived": 25000,
      "outstanding": 110654,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Jailaxmi K K",
      "center": "Selu",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 100,
      "rate": 2999,
      "grossBill": 299900,
      "netPayable": 271308,
      "totalReceived": 50000,
      "outstanding": 221308,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Jailaxmi K K",
      "center": "Selu",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 50,
      "rate": 3199,
      "grossBill": 159950,
      "netPayable": 142554,
      "totalReceived": 50000,
      "outstanding": 92554,
      "seedName": "Avantika"
    },
    {
      "partyName": "Shetmauli k k",
      "center": "Sindhi",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 50,
      "rate": 2999,
      "grossBill": 149950,
      "netPayable": 135654,
      "totalReceived": 25000,
      "outstanding": 110654,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Venkatsh k mac",
      "center": "Sindhi",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 100,
      "rate": 2999,
      "grossBill": 299900,
      "netPayable": 273608,
      "totalReceived": 25000,
      "outstanding": 248608,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Jai Jagannath",
      "center": "Vashi",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 40,
      "rate": 2999,
      "grossBill": 119960,
      "netPayable": 105763,
      "totalReceived": 50000,
      "outstanding": 55763,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Jai Jagannath",
      "center": "Vashi",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 20,
      "rate": 3199,
      "grossBill": 63980,
      "netPayable": 54262,
      "totalReceived": 50000,
      "outstanding": 4262,
      "seedName": "Avantika"
    },
    {
      "partyName": "Laxmi k k",
      "center": "Waigaon",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 80,
      "rate": 2999,
      "grossBill": 239920,
      "netPayable": 218426,
      "totalReceived": 25000,
      "outstanding": 193426,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Laxmi k k",
      "center": "Waigaon",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 20,
      "rate": 3199,
      "grossBill": 63980,
      "netPayable": 56562,
      "totalReceived": 25000,
      "outstanding": 31562,
      "seedName": "Avantika"
    },
    {
      "partyName": "Jagdamba K K",
      "center": "Waigaon",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 50,
      "rate": 3199,
      "grossBill": 159950,
      "netPayable": 144854,
      "totalReceived": 25000,
      "outstanding": 119854,
      "seedName": "Avantika"
    },
    {
      "partyName": "Sethkari K K",
      "center": "Waigaon",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 200,
      "rate": 2999,
      "grossBill": 599800,
      "netPayable": 547216,
      "totalReceived": 50000,
      "outstanding": 497216,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Badnore Agro",
      "center": "Wardha",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 100,
      "rate": 2999,
      "grossBill": 299900,
      "netPayable": 271308,
      "totalReceived": 50000,
      "outstanding": 221308,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Badnore Agro",
      "center": "Wardha",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 100,
      "rate": 3199,
      "grossBill": 319900,
      "netPayable": 289708,
      "totalReceived": 50000,
      "outstanding": 239708,
      "seedName": "Avantika"
    },
    {
      "partyName": "Gayatri Biyane",
      "center": "Wardha",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 50,
      "rate": 2999,
      "grossBill": 149950,
      "netPayable": 135654,
      "totalReceived": 25000,
      "outstanding": 110654,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Kiran k k",
      "center": "Pawnar",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 30,
      "rate": 2999,
      "grossBill": 89970,
      "netPayable": 78172,
      "totalReceived": 50000,
      "outstanding": 28172,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Kiran k k",
      "center": "Pawnar",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 0,
      "rate": 3199,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 50000,
      "outstanding": -50000,
      "seedName": "Avantika"
    },
    {
      "partyName": "Maa Vaishnavi",
      "center": "Taroda",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 30,
      "rate": 2999,
      "grossBill": 89970,
      "netPayable": 80472,
      "totalReceived": 25000,
      "outstanding": 55472,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Tulza Bhavani k k",
      "center": "Pailanpur",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 75,
      "rate": 2999,
      "grossBill": 224925,
      "netPayable": 204631,
      "totalReceived": 25000,
      "outstanding": 179631,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Tulza Bhavani k k",
      "center": "Pailanpur",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 0,
      "rate": 3199,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 25000,
      "outstanding": -25000,
      "seedName": "Avantika"
    },
    {
      "partyName": "Vikaram KSK",
      "center": "Vijay Gopal",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 50,
      "rate": 2999,
      "grossBill": 149950,
      "netPayable": 135654,
      "totalReceived": 25000,
      "outstanding": 110654,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Bhojaji",
      "center": "Madni",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 50,
      "rate": 2999,
      "grossBill": 149950,
      "netPayable": 135654,
      "totalReceived": 25000,
      "outstanding": 110654,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Saraswati k k",
      "center": "Padegaon",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 50,
      "rate": 2999,
      "grossBill": 149950,
      "netPayable": 135654,
      "totalReceived": 25000,
      "outstanding": 110654,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Saraswati k k",
      "center": "Padegaon",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 50,
      "rate": 3199,
      "grossBill": 159950,
      "netPayable": 144854,
      "totalReceived": 25000,
      "outstanding": 119854,
      "seedName": "Avantika"
    },
    {
      "partyName": "Hore k k",
      "center": "ShirPur",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 50,
      "rate": 2999,
      "grossBill": 149950,
      "netPayable": 133354,
      "totalReceived": 50000,
      "outstanding": 83354,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Hore k k",
      "center": "ShirPur",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 50,
      "rate": 3199,
      "grossBill": 159950,
      "netPayable": 142554,
      "totalReceived": 50000,
      "outstanding": 92554,
      "seedName": "Avantika"
    },
    {
      "partyName": "Tejas",
      "center": "Kopara",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 100,
      "rate": 2999,
      "grossBill": 299900,
      "netPayable": 273608,
      "totalReceived": 25000,
      "outstanding": 248608,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Swami samarth",
      "center": "Yelakeli",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 50,
      "rate": 2999,
      "grossBill": 149950,
      "netPayable": 135654,
      "totalReceived": 25000,
      "outstanding": 110654,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Swami samarth",
      "center": "Yelakeli",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 10,
      "rate": 3199,
      "grossBill": 31990,
      "netPayable": 27131,
      "totalReceived": 25000,
      "outstanding": 2131,
      "seedName": "Avantika"
    },
    {
      "partyName": "Shradha",
      "center": "Wela",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 25,
      "rate": 2999,
      "grossBill": 74975,
      "netPayable": 66677,
      "totalReceived": 25000,
      "outstanding": 41677,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Shradha",
      "center": "Wela",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 25,
      "rate": 3199,
      "grossBill": 79975,
      "netPayable": 71277,
      "totalReceived": 25000,
      "outstanding": 46277,
      "seedName": "Avantika"
    },
    {
      "partyName": "Kisan Krushi",
      "center": "Pipri",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 25,
      "rate": 2999,
      "grossBill": 74975,
      "netPayable": 66677,
      "totalReceived": 25000,
      "outstanding": 41677,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Kisan Krushi",
      "center": "Pipri",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 25,
      "rate": 3199,
      "grossBill": 79975,
      "netPayable": 71277,
      "totalReceived": 25000,
      "outstanding": 46277,
      "seedName": "Avantika"
    },
    {
      "partyName": "Balaji k k",
      "center": "Wahitpur",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 25,
      "rate": 2999,
      "grossBill": 74975,
      "netPayable": 66677,
      "totalReceived": 25000,
      "outstanding": 41677,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Balaji k k",
      "center": "Wahitpur",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 25,
      "rate": 3199,
      "grossBill": 79975,
      "netPayable": 71277,
      "totalReceived": 25000,
      "outstanding": 46277,
      "seedName": "Avantika"
    },
    {
      "partyName": "Rutika k k",
      "center": "Talni",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 30,
      "rate": 2999,
      "grossBill": 89970,
      "netPayable": 80472,
      "totalReceived": 25000,
      "outstanding": 55472,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Rutika k k",
      "center": "Talni",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 0,
      "rate": 3199,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 25000,
      "outstanding": -25000,
      "seedName": "Avantika"
    },
    {
      "partyName": "Shri Maharudra",
      "center": "Rajapur",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": null,
      "rate": 2999,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 25000,
      "outstanding": -25000,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Shri Maharudra",
      "center": "Rajapur",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": null,
      "rate": 3199,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 25000,
      "outstanding": -25000,
      "seedName": "Avantika"
    },
    {
      "partyName": "Renuka k k",
      "center": "Salod",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 25,
      "rate": 2999,
      "grossBill": 74975,
      "netPayable": 66677,
      "totalReceived": 25000,
      "outstanding": 41677,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Renuka k k",
      "center": "Salod",
      "companyId": "CO02",
      "seedId": "S004",
      "bagsFinal": 25,
      "rate": 3199,
      "grossBill": 79975,
      "netPayable": 71277,
      "totalReceived": 25000,
      "outstanding": 46277,
      "seedName": "Avantika"
    },
    {
      "partyName": "Radhika k k",
      "center": "Salod",
      "companyId": "CO02",
      "seedId": "S003",
      "bagsFinal": 50,
      "rate": 2999,
      "grossBill": 149950,
      "netPayable": 135654,
      "totalReceived": 25000,
      "outstanding": 110654,
      "seedName": "Pushpa"
    },
    {
      "partyName": "Krushna K k",
      "center": "Aasta",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 34,
      "rate": 3000,
      "grossBill": 102000,
      "netPayable": 93116,
      "totalReceived": 62024.944,
      "outstanding": 31091.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Krushna K k",
      "center": "Aasta",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 5,
      "rate": 3000,
      "grossBill": 15000,
      "netPayable": 12206,
      "totalReceived": 62024.944,
      "outstanding": -49818.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Maa bhavani",
      "center": "Agargaon",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 57,
      "rate": 3000,
      "grossBill": 171000,
      "netPayable": 156100,
      "totalReceived": 106549.944,
      "outstanding": 49550.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Maa bhavani",
      "center": "Agargaon",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 9,
      "rate": 3000,
      "grossBill": 27000,
      "netPayable": 22180,
      "totalReceived": 106549.944,
      "outstanding": -84369.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Gupta kk",
      "center": "Anji",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 57,
      "rate": 3000,
      "grossBill": 171000,
      "netPayable": 156100,
      "totalReceived": 106549.944,
      "outstanding": 49550.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Gupta kk",
      "center": "Anji",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 9,
      "rate": 3000,
      "grossBill": 27000,
      "netPayable": 22180,
      "totalReceived": 106549.944,
      "outstanding": -84369.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Jai Shree k k",
      "center": "Arvi",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 285,
      "rate": 3000,
      "grossBill": 855000,
      "netPayable": 778177,
      "totalReceived": 533249.944,
      "outstanding": 244927.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Jai Shree k k",
      "center": "Arvi",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 45,
      "rate": 3000,
      "grossBill": 135000,
      "netPayable": 108577,
      "totalReceived": 533249.944,
      "outstanding": -424672.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Prabhai k k",
      "center": "Bedona",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 64,
      "rate": 3000,
      "grossBill": 192000,
      "netPayable": 172915,
      "totalReceived": 51309.944,
      "outstanding": 121605.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Prabhai k k",
      "center": "Bedona",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 18,
      "rate": 3000,
      "grossBill": 54000,
      "netPayable": 44575,
      "totalReceived": 51309.944,
      "outstanding": -6734.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Sital k k",
      "center": "Bhidi",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 57,
      "rate": 3000,
      "grossBill": 171000,
      "netPayable": 155635,
      "totalReceived": 105549.944,
      "outstanding": 50085.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Sital k k",
      "center": "Bhidi",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 9,
      "rate": 3000,
      "grossBill": 27000,
      "netPayable": 21715,
      "totalReceived": 105549.944,
      "outstanding": -83834.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Piyush k k",
      "center": "Borgaon Aloda",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 114,
      "rate": 3000,
      "grossBill": 342000,
      "netPayable": 311271,
      "totalReceived": 211099.944,
      "outstanding": 100171.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Piyush k k",
      "center": "Borgaon Aloda",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 18,
      "rate": 3000,
      "grossBill": 54000,
      "netPayable": 43431,
      "totalReceived": 211099.944,
      "outstanding": -167668.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Umre k k",
      "center": "Deoli",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 285,
      "rate": 3000,
      "grossBill": 855000,
      "netPayable": 778177,
      "totalReceived": 527749.944,
      "outstanding": 250427.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Umre k k",
      "center": "Deoli",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 45,
      "rate": 3000,
      "grossBill": 135000,
      "netPayable": 108577,
      "totalReceived": 527749.944,
      "outstanding": -419172.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Sidhi k k",
      "center": "Deoli",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 171,
      "rate": 3000,
      "grossBill": 513000,
      "netPayable": 466906,
      "totalReceived": 316649.944,
      "outstanding": 150256.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Sidhi k k",
      "center": "Deoli",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 27,
      "rate": 3000,
      "grossBill": 81000,
      "netPayable": 65146,
      "totalReceived": 316649.944,
      "outstanding": -251503.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Bhoyar k k",
      "center": "Deoli",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 28,
      "rate": 3000,
      "grossBill": 84000,
      "netPayable": 76655,
      "totalReceived": 53274.944,
      "outstanding": 23380.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Bhoyar k k",
      "center": "Deoli",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 5,
      "rate": 3000,
      "grossBill": 15000,
      "netPayable": 12485,
      "totalReceived": 53274.944,
      "outstanding": -40789.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Krushi Seva",
      "center": "Hinganghat",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 570,
      "rate": 3000,
      "grossBill": 1710000,
      "netPayable": 1556355,
      "totalReceived": 1060999.944,
      "outstanding": 495355.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Krushi Seva",
      "center": "Hinganghat",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 90,
      "rate": 3000,
      "grossBill": 270000,
      "netPayable": 217155,
      "totalReceived": 1060999.944,
      "outstanding": -843844.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Kothari Krushi",
      "center": "Hinganghat",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 171,
      "rate": 3000,
      "grossBill": 513000,
      "netPayable": 466906,
      "totalReceived": 316649.944,
      "outstanding": 150256.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Kothari Krushi",
      "center": "Hinganghat",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 27,
      "rate": 3000,
      "grossBill": 81000,
      "netPayable": 65146,
      "totalReceived": 316649.944,
      "outstanding": -251503.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Chintaman k k",
      "center": "Inzala",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 114,
      "rate": 3000,
      "grossBill": 342000,
      "netPayable": 311252,
      "totalReceived": 210059.944,
      "outstanding": 101192.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Chintaman k k",
      "center": "Inzala",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 18,
      "rate": 3000,
      "grossBill": 54000,
      "netPayable": 43412,
      "totalReceived": 210059.944,
      "outstanding": -166647.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Ganesh Agr",
      "center": "Kharangna",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 57,
      "rate": 3000,
      "grossBill": 171000,
      "netPayable": 155635,
      "totalReceived": 105549.944,
      "outstanding": 50085.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Ganesh Agr",
      "center": "Kharangna",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 9,
      "rate": 3000,
      "grossBill": 27000,
      "netPayable": 21715,
      "totalReceived": 105549.944,
      "outstanding": -83834.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Adarsh k k",
      "center": "Kora",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 171,
      "rate": 3000,
      "grossBill": 513000,
      "netPayable": 466906,
      "totalReceived": 316649.944,
      "outstanding": 150256.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Adarsh k k",
      "center": "Kora",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 27,
      "rate": 3000,
      "grossBill": 81000,
      "netPayable": 65146,
      "totalReceived": 316649.944,
      "outstanding": -251503.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Ram k k",
      "center": "Madni",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 114,
      "rate": 3000,
      "grossBill": 342000,
      "netPayable": 311271,
      "totalReceived": 211099.944,
      "outstanding": 100171.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Ram k k",
      "center": "Madni",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 18,
      "rate": 3000,
      "grossBill": 54000,
      "netPayable": 43431,
      "totalReceived": 211099.944,
      "outstanding": -167668.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Laxmi k",
      "center": "Mahakal",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 46,
      "rate": 3000,
      "grossBill": 138000,
      "netPayable": 125992,
      "totalReceived": 85874.944,
      "outstanding": 40117.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Laxmi k",
      "center": "Mahakal",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 7,
      "rate": 3000,
      "grossBill": 21000,
      "netPayable": 17182,
      "totalReceived": 85874.944,
      "outstanding": -68692.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Bharat k k",
      "center": "Mandgaon",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 46,
      "rate": 3000,
      "grossBill": 138000,
      "netPayable": 125992,
      "totalReceived": 85874.944,
      "outstanding": 40117.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Bharat k k",
      "center": "Mandgaon",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 7,
      "rate": 3000,
      "grossBill": 21000,
      "netPayable": 17182,
      "totalReceived": 85874.944,
      "outstanding": -68692.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Saraswati k kk",
      "center": "Padegaon",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 57,
      "rate": 3000,
      "grossBill": 171000,
      "netPayable": 156100,
      "totalReceived": 106549.944,
      "outstanding": 49550.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Saraswati k kk",
      "center": "Padegaon",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 9,
      "rate": 3000,
      "grossBill": 27000,
      "netPayable": 22180,
      "totalReceived": 106549.944,
      "outstanding": -84369.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Samarth k k",
      "center": "Pavni",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 57,
      "rate": 3000,
      "grossBill": 171000,
      "netPayable": 156100,
      "totalReceived": 106549.944,
      "outstanding": 49550.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Samarth k k",
      "center": "Pavni",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 9,
      "rate": 3000,
      "grossBill": 27000,
      "netPayable": 22180,
      "totalReceived": 106549.944,
      "outstanding": -84369.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Taori ksk",
      "center": "Pulgaon",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 285,
      "rate": 3000,
      "grossBill": 855000,
      "netPayable": 778177,
      "totalReceived": 527749.944,
      "outstanding": 250427.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Taori ksk",
      "center": "Pulgaon",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 45,
      "rate": 3000,
      "grossBill": 135000,
      "netPayable": 108577,
      "totalReceived": 527749.944,
      "outstanding": -419172.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Dhamiya k k",
      "center": "Pulgaon",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 171,
      "rate": 3000,
      "grossBill": 513000,
      "netPayable": 466906,
      "totalReceived": 316649.944,
      "outstanding": 150256.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Dhamiya k k",
      "center": "Pulgaon",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 27,
      "rate": 3000,
      "grossBill": 81000,
      "netPayable": 65146,
      "totalReceived": 316649.944,
      "outstanding": -251503.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Kisan Agro",
      "center": "Pulgaon",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 57,
      "rate": 3000,
      "grossBill": 171000,
      "netPayable": 155635,
      "totalReceived": 105549.944,
      "outstanding": 50085.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Kisan Agro",
      "center": "Pulgaon",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 9,
      "rate": 3000,
      "grossBill": 27000,
      "netPayable": 21715,
      "totalReceived": 105549.944,
      "outstanding": -83834.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Krush Karanti",
      "center": "Samudrapur",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 228,
      "rate": 3000,
      "grossBill": 684000,
      "netPayable": 622542,
      "totalReceived": 422199.944,
      "outstanding": 200342.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Krush Karanti",
      "center": "Samudrapur",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 36,
      "rate": 3000,
      "grossBill": 108000,
      "netPayable": 86862,
      "totalReceived": 422199.944,
      "outstanding": -335337.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Agrawal k k",
      "center": "Samudrapur",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 57,
      "rate": 3000,
      "grossBill": 171000,
      "netPayable": 155635,
      "totalReceived": 105549.944,
      "outstanding": 50085.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Agrawal k k",
      "center": "Samudrapur",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 9,
      "rate": 3000,
      "grossBill": 27000,
      "netPayable": 21715,
      "totalReceived": 105549.944,
      "outstanding": -83834.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Hore k k",
      "center": "Shirpur",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 114,
      "rate": 3000,
      "grossBill": 342000,
      "netPayable": 311252,
      "totalReceived": 212809.944,
      "outstanding": 98442.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Hore k k",
      "center": "Shirpur",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 18,
      "rate": 3000,
      "grossBill": 54000,
      "netPayable": 43412,
      "totalReceived": 212809.944,
      "outstanding": -169397.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Shetkari Suvhidah",
      "center": "Sindhi",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 228,
      "rate": 3000,
      "grossBill": 684000,
      "netPayable": 622542,
      "totalReceived": 422199.944,
      "outstanding": 200342.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Shetkari Suvhidah",
      "center": "Sindhi",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 36,
      "rate": 3000,
      "grossBill": 108000,
      "netPayable": 86862,
      "totalReceived": 422199.944,
      "outstanding": -335337.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Bhushan k k",
      "center": "Sindhi",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 171,
      "rate": 3000,
      "grossBill": 513000,
      "netPayable": 466906,
      "totalReceived": 316649.944,
      "outstanding": 150256.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Bhushan k k",
      "center": "Sindhi",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 27,
      "rate": 3000,
      "grossBill": 81000,
      "netPayable": 65146,
      "totalReceived": 316649.944,
      "outstanding": -251503.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Shetmauli k k",
      "center": "Sindhi",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 57,
      "rate": 3000,
      "grossBill": 171000,
      "netPayable": 156100,
      "totalReceived": 106549.944,
      "outstanding": 49550.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Shetmauli k k",
      "center": "Sindhi",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 9,
      "rate": 3000,
      "grossBill": 27000,
      "netPayable": 22180,
      "totalReceived": 106549.944,
      "outstanding": -84369.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Krushi Vikas",
      "center": "Sindhi",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 57,
      "rate": 3000,
      "grossBill": 171000,
      "netPayable": 155635,
      "totalReceived": 105549.944,
      "outstanding": 50085.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Krushi Vikas",
      "center": "Sindhi",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 9,
      "rate": 3000,
      "grossBill": 27000,
      "netPayable": 21715,
      "totalReceived": 105549.944,
      "outstanding": -83834.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Rutika k k",
      "center": "Talni",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 86,
      "rate": 3000,
      "grossBill": 258000,
      "netPayable": 235546,
      "totalReceived": 159824.944,
      "outstanding": 75721.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Rutika k k",
      "center": "Talni",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 13,
      "rate": 3000,
      "grossBill": 39000,
      "netPayable": 31876,
      "totalReceived": 159824.944,
      "outstanding": -127948.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Vaishnavi",
      "center": "Taroda",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 57,
      "rate": 3000,
      "grossBill": 171000,
      "netPayable": 156100,
      "totalReceived": 106549.944,
      "outstanding": 49550.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Vaishnavi",
      "center": "Taroda",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 9,
      "rate": 3000,
      "grossBill": 27000,
      "netPayable": 22180,
      "totalReceived": 106549.944,
      "outstanding": -84369.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Gandhi k k",
      "center": "Wadona",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 114,
      "rate": 3000,
      "grossBill": 342000,
      "netPayable": 311252,
      "totalReceived": 210059.944,
      "outstanding": 101192.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Gandhi k k",
      "center": "Wadona",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 18,
      "rate": 3000,
      "grossBill": 54000,
      "netPayable": 43412,
      "totalReceived": 210059.944,
      "outstanding": -166647.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Jagdamba k k",
      "center": "Waigaon",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 285,
      "rate": 3000,
      "grossBill": 855000,
      "netPayable": 778177,
      "totalReceived": 530499.944,
      "outstanding": 247677.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Jagdamba k k",
      "center": "Waigaon",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 45,
      "rate": 3000,
      "grossBill": 135000,
      "netPayable": 108577,
      "totalReceived": 530499.944,
      "outstanding": -421922.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Karthik k k",
      "center": "Waigaon",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 114,
      "rate": 3000,
      "grossBill": 342000,
      "netPayable": 312201,
      "totalReceived": 213099.944,
      "outstanding": 99101.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Karthik k k",
      "center": "Waigaon",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 18,
      "rate": 3000,
      "grossBill": 54000,
      "netPayable": 44361,
      "totalReceived": 213099.944,
      "outstanding": -168738.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Annadata k k",
      "center": "Waigaon",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 57,
      "rate": 3000,
      "grossBill": 171000,
      "netPayable": 156100,
      "totalReceived": 106549.944,
      "outstanding": 49550.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Annadata k k",
      "center": "Waigaon",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 9,
      "rate": 3000,
      "grossBill": 27000,
      "netPayable": 22180,
      "totalReceived": 106549.944,
      "outstanding": -84369.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Kothari K k",
      "center": "Wardha",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 114,
      "rate": 3000,
      "grossBill": 342000,
      "netPayable": 311252,
      "totalReceived": 210059.944,
      "outstanding": 101192.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Kothari K k",
      "center": "Wardha",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 18,
      "rate": 3000,
      "grossBill": 54000,
      "netPayable": 43412,
      "totalReceived": 210059.944,
      "outstanding": -166647.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Chandak Traders",
      "center": "Wardha",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 57,
      "rate": 3000,
      "grossBill": 171000,
      "netPayable": 156100,
      "totalReceived": 106549.944,
      "outstanding": 49550.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Chandak Traders",
      "center": "Wardha",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 9,
      "rate": 3000,
      "grossBill": 27000,
      "netPayable": 22180,
      "totalReceived": 106549.944,
      "outstanding": -84369.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Rathi Traders",
      "center": "Wardha",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 57,
      "rate": 3000,
      "grossBill": 171000,
      "netPayable": 155635,
      "totalReceived": 105549.944,
      "outstanding": 50085.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Rathi Traders",
      "center": "Wardha",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 9,
      "rate": 3000,
      "grossBill": 27000,
      "netPayable": 21715,
      "totalReceived": 105549.944,
      "outstanding": -83834.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Vidharbh Krushi Kendre",
      "center": "Wardha",
      "companyId": "CO03",
      "seedId": "S005",
      "bagsFinal": 57,
      "rate": 3000,
      "grossBill": 171000,
      "netPayable": 155635,
      "totalReceived": 105549.944,
      "outstanding": 50085.056,
      "seedName": "Hututu"
    },
    {
      "partyName": "Vidharbh Krushi Kendre",
      "center": "Wardha",
      "companyId": "CO03",
      "seedId": "S006",
      "bagsFinal": 9,
      "rate": 3000,
      "grossBill": 27000,
      "netPayable": 21715,
      "totalReceived": 105549.944,
      "outstanding": -83834.944,
      "seedName": "Kho Kho"
    },
    {
      "partyName": "Rathi Seeds Co",
      "center": "Wardha",
      "companyId": "CO04",
      "seedId": "S010",
      "bagsFinal": 670,
      "rate": null,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Baliraja"
    },
    {
      "partyName": "Kothari Krushi Kendre",
      "center": "Hinganghat",
      "companyId": "CO04",
      "seedId": "S010",
      "bagsFinal": 90,
      "rate": null,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Baliraja"
    },
    {
      "partyName": "Krushi Seva",
      "center": "Hinganghat",
      "companyId": "CO04",
      "seedId": "S010",
      "bagsFinal": 80,
      "rate": null,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Baliraja"
    },
    {
      "partyName": "Ganesh k k",
      "center": "Kora",
      "companyId": "CO04",
      "seedId": "S010",
      "bagsFinal": 100,
      "rate": null,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Baliraja"
    },
    {
      "partyName": "Jagdamba k k",
      "center": "Kora",
      "companyId": "CO04",
      "seedId": "S010",
      "bagsFinal": 60,
      "rate": null,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Baliraja"
    },
    {
      "partyName": "Deotale K k",
      "center": "Hinganghat",
      "companyId": "CO04",
      "seedId": "S010",
      "bagsFinal": 300,
      "rate": null,
      "grossBill": 0,
      "netPayable": 0,
      "totalReceived": 0,
      "outstanding": 0,
      "seedName": "Baliraja"
    }
  ]
};

  function init() {
    // BYPASS LOGIN FOR PHASE 2
    document.getElementById('loginView').classList.remove('active');
    document.getElementById('mainNav').style.display = 'flex';
    
    bindEvents();
    // listenToCollections(); /* BYPASSED FOR LOCAL DEMO */
    switchView('dashboard');
  }

  /* ============ FIRESTORE LISTENERS ============ */
  function listenToCollections() {
    onSnapshot(collection(db, "companies"), (snap) => {
      state.companies = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderSetupCompanies();
      renderBillingView();
    });

    onSnapshot(collection(db, "seeds"), (snap) => {
      state.seeds = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderSetupSeeds();
    });

    onSnapshot(collection(db, "parties"), (snap) => {
      state.parties = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderPartiesList();
      renderDashboard();
    });

    onSnapshot(collection(db, "bookings"), (snap) => {
      state.bookings = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderDashboard();
      onBillingCompanyChange();
    });
  }

  /* ============ NAVIGATION ============ */
  function switchView(viewId) {
    state.activeView = viewId;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(viewId + 'View')?.classList.add('active');
    
    const activeBtn = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.textContent.toLowerCase().includes(viewId.substring(0,4)));
    if (activeBtn) activeBtn.classList.add('active');

    if (viewId === 'dashboard') renderDashboard();
    if (viewId === 'billing') renderBillingView();
    if (viewId === 'parties') renderPartiesList();
    if (viewId === 'setup') {
      renderSetupCompanies();
      renderSetupSeeds();
    }
  }

  /* ============ PHASE 2: DASHBOARD (LEDGER) ============ */
  function renderDashboard() {
    const container = document.getElementById('dashboardContainer');
    if (!container) return;

    if (state.parties.length === 0 || state.bookings.length === 0) {
      container.innerHTML = `<div class="card"><p class="text-dim">No ledger data available. Import DB in Setup.</p></div>`;
      return;
    }

    // Group bookings by party
    let ledgerHTML = '';
    
    for (const p of state.parties) {
      const pBookings = state.bookings.filter(b => b.partyName === p.name);
      if (pBookings.length === 0) continue;
      
      let totalGross = 0;
      let totalReceived = 0;
      let totalOutstanding = 0;

      pBookings.forEach(b => {
        totalGross += Number(b.grossBill) || 0;
        totalReceived += Number(b.totalReceived) || 0;
        totalOutstanding += Number(b.outstanding) || 0;
      });

      const isClear = totalOutstanding <= 0;

      ledgerHTML += `
        <div class="card">
          <h3 style="margin:0; cursor:pointer; color:var(--clr-primary);" onclick="App.openPartyDetailModal('${escapeHTML(p.name).replace(/'/g, "\\'")}')">${escapeHTML(p.name)} 🔗</h3>
          <p class="text-dim text-sm" style="margin-bottom:12px;">📍 ${escapeHTML(p.center)}</p>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span>Gross Bill:</span>
            <strong>${formatCurrency(totalGross)}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span>Received:</span>
            <strong style="color:var(--clr-success)">${formatCurrency(totalReceived)}</strong>
          </div>
          <hr style="border:0; border-top:1px solid var(--border-clr); margin:8px 0;">
          <div style="display:flex; justify-content:space-between;">
            <span>Outstanding:</span>
            <strong style="color:${isClear ? 'var(--clr-success)' : 'var(--clr-danger)'}">${formatCurrency(totalOutstanding)}</strong>
          </div>
        </div>
      `;
    }

    container.innerHTML = ledgerHTML;
  }

  /* ============ PHASE 2: BILLING ============ */
  function renderBillingView() {
    const select = document.getElementById('billingCompanySelect');
    if (!select) return;
    
    const currVal = select.value;
    select.innerHTML = '<option value="">-- Choose Company --</option>' + 
      state.companies.map(c => `<option value="${c.id}">${escapeHTML(c.name)}</option>`).join('');
    select.value = currVal;
  }

  function onBillingCompanyChange() {
    const coId = document.getElementById('billingCompanySelect').value;
    const container = document.getElementById('billingPartiesContainer');
    if (!coId) {
      container.innerHTML = '';
      return;
    }

    const co = state.companies.find(c => c.id === coId);
    if (!co) return;

    // Filter bookings for this company
    const coBookings = state.bookings.filter(b => b.companyId === co.coId);
    if (coBookings.length === 0) {
      container.innerHTML = `<div class="card mt-16"><p class="text-dim">No bookings found for this company.</p></div>`;
      return;
    }

    // Group by party
    const partyMap = {};
    coBookings.forEach(b => {
      if (!partyMap[b.partyName]) partyMap[b.partyName] = [];
      partyMap[b.partyName].push(b);
    });

    let billsHTML = '';
    for (const [partyName, bks] of Object.entries(partyMap)) {
      const party = state.parties.find(p => p.name === partyName) || { name: partyName, phone: '' };
      
      let seedLines = '';
      let netTotal = 0;

      bks.forEach(b => {
        const seed = state.seeds.find(s => s.seedId === b.seedId) || { name: b.seedName || "Unknown" };
        netTotal += Number(b.netPayable) || 0;
        seedLines += `
          <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:0.9rem;">
            <span>${escapeHTML(seed.name)} (${b.bagsFinal} bags @ ₹${b.rate})</span>
            <strong>${formatCurrency(b.netPayable)}</strong>
          </div>
        `;
      });

      // WA Link
      const textBill = `🌾 *${co.name}*\n------------------\n👤 Party: ${party.name}\n${bks.map(b => `• ${b.seedName || 'Seed'} (${b.bagsFinal} bags): ₹${b.netPayable}`).join('\n')}\n------------------\n💰 *Total: ${formatCurrency(netTotal)}*`;
      const waLink = party.phone ? `https://web.whatsapp.com/send/?phone=${party.phone}&text=${encodeURIComponent(textBill)}` : '#';

      billsHTML += `
        <div class="card mt-16">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h3 style="margin:0">${escapeHTML(party.name)}</h3>
            <span class="text-dim">Net: <strong style="color:var(--text-primary)">${formatCurrency(netTotal)}</strong></span>
          </div>
          <div style="background:var(--bg-primary); padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border-clr);">
            ${seedLines}
          </div>
          <div style="margin-top:12px; display:flex; gap:8px;">
            <a href="${waLink}" target="_blank" class="btn btn--primary btn--sm" ${!party.phone ? 'style="pointer-events:none; opacity:0.5"' : ''}>
              💬 Send on WhatsApp
            </a>
          </div>
        </div>
      `;
    }

    container.innerHTML = billsHTML;
  }

  /* ============ PHASE 1: SETUP (COMPANIES & SEEDS) ============ */
  function renderSetupCompanies() {
    const container = document.getElementById('setupCompaniesList');
    if (!container) return;
    if (state.companies.length === 0) {
      container.innerHTML = `<p class="text-dim">No companies added yet.</p>`;
      return;
    }
    container.innerHTML = state.companies.map(c => `
      <div style="border-bottom: 1px solid var(--border-clr); padding: 8px 0;">
        <div><strong>${escapeHTML(c.name)}</strong></div>
      </div>
    `).join('');
  }

  function renderSetupSeeds() {
    const container = document.getElementById('setupSeedsList');
    if (!container) return;
    if (state.seeds.length === 0) {
      container.innerHTML = `<p class="text-dim">No seeds added yet.</p>`;
      return;
    }
    container.innerHTML = state.seeds.map(s => {
      return `
      <div style="border-bottom: 1px solid var(--border-clr); padding: 8px 0;">
        <div><strong>${escapeHTML(s.name)}</strong> (${escapeHTML(s.weight || 0)} Kg)</div>
        <div class="text-dim text-sm">Rate: ₹${s.currentRate || 0}</div>
      </div>
    `}).join('');
  }

  function openAddCompanyModal() { showToast("Add Company Form Loaded"); }
  function openAddSeedModal() { showToast("Add Seed Form Loaded"); }
  function openAddPartyModal() { showToast("Add Party Form Loaded"); }

  function openPartyDetailModal(partyName) {
    const pBookings = state.bookings.filter(b => b.partyName === partyName);
    
    let detailsHTML = \`
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
        <h2 style="margin:0">\${escapeHTML(partyName)}</h2>
        <button class="btn btn--outline btn--sm close-modal-btn" onclick="App.closeModals(event)">✕</button>
      </div>
      <div style="max-height: 70vh; overflow-y: auto; padding-right:8px;">
    \`;

    if (pBookings.length === 0) {
      detailsHTML += \`<p class="text-dim">No transactions found.</p></div>\`;
    } else {
      // Group by company
      const coMap = {};
      pBookings.forEach(b => {
        const coName = state.companies.find(c => c.coId === b.companyId)?.name || b.companyId;
        if (!coMap[coName]) coMap[coName] = [];
        coMap[coName].push(b);
      });

      for (const [coName, bks] of Object.entries(coMap)) {
        let netTotal = 0;
        let seedLines = '';
        bks.forEach(b => {
          netTotal += Number(b.netPayable) || 0;
          seedLines += \`
            <div style="display:flex; justify-content:space-between; font-size: 0.9rem; margin-bottom:4px;">
              <span>\${escapeHTML(b.seedName)} (\${b.bagsFinal} bags)</span>
              <span>\${formatCurrency(b.netPayable)}</span>
            </div>
          \`;
        });
        
        detailsHTML += \`
          <div class="card" style="margin-bottom: 12px; padding: 12px; background:var(--bg-page);">
            <h4 style="margin:0 0 8px 0; color: var(--text-primary);">\${escapeHTML(coName)}</h4>
            <div style="padding-bottom:8px; border-bottom: 1px solid var(--border-clr); margin-bottom:8px;">
              \${seedLines}
            </div>
            <div style="display:flex; justify-content:space-between; font-weight:bold;">
              <span>Total:</span>
              <span>\${formatCurrency(netTotal)}</span>
            </div>
          </div>
        \`;
      }
      detailsHTML += \`</div>\`;
    }

    const sheet = document.getElementById('addModalSheet');
    if (sheet) {
      sheet.innerHTML = detailsHTML;
      document.getElementById('addModalOverlay').classList.add('open');
    }
  }

  /* ============ PHASE 1: PARTIES ============ */
  function renderPartiesList() {
    const container = document.getElementById('partiesListContainer');
    if (!container) return;
    if (state.parties.length === 0) {
      container.innerHTML = `<div class="card"><p class="text-dim">No parties found. Add one above.</p></div>`;
      return;
    }
    container.innerHTML = state.parties.map(p => `
      <div class="card" style="display:flex; flex-direction:column; gap:4px;">
        <h3 style="margin:0; cursor:pointer; color:var(--clr-primary);" onclick="App.openPartyDetailModal('${escapeHTML(p.name).replace(/'/g, "\\'")}')">${escapeHTML(p.name)} 🔗</h3>
        <div class="text-dim text-sm">📍 ${escapeHTML(p.center || 'No Center')} | 📞 ${escapeHTML(p.phone || 'N/A')}</div>
      </div>
    `).join('');
  }

  /* ============ DATABASE IMPORT ============ */
  async function importDatabase() {
    if (!confirm("Are you sure you want to run the data importer?")) return;
    try {
      showToast("Downloading import data...");
      
      const res = await fetch('import_data.json');
      const data = await res.json();

      const bRes = await fetch('import_bookings.json');
      const bData = await bRes.json();
      
      showToast("Importing Companies...");
      for (const co of data.companies) {
        await addDoc(collection(db, "companies"), {
          coId: co["Co_ID"],
          name: co["Company Name"] || "Unknown",
          season: co["Season"] || "",
          bank: co["Bank"] || "",
          accountNo: co["Account No"] || "",
          ifsc: co["IFSC"] || "",
          notes: co["Notes"] || ""
        });
      }

      showToast("Importing Seeds...");
      for (const s of data.seeds) {
        await addDoc(collection(db, "seeds"), {
          seedId: s["Seed_ID"],
          companyId: s["Co_ID"],
          name: s["Seed Name"] || "Unknown",
          weight: s["Bag Wt (Kg)"] || 0,
          currentRate: s["Current Rate/Bag (₹)"] || 0,
          allotment: s["Allotment %"] || 1
        });
      }

      showToast("Importing Parties...");
      for (const p of data.parties) {
        await addDoc(collection(db, "parties"), {
          name: p["Party Name"] || "Unknown",
          center: p["Center"] || "",
          district: p["District"] || "",
          phone: p["Phone"] || "",
          isActive: p["Active"] === "Y"
        });
      }

      showToast("Importing Bookings...");
      for (const b of bData.bookings) {
        await addDoc(collection(db, "bookings"), {
          partyName: b["Party Name"],
          center: b["Center"],
          companyId: b["Company (Co_ID)"],
          seedId: b["Seed Name (Seed_ID)"],
          bagsFinal: b["Bags Final (Allotted)"],
          rate: b["Rate at Booking (₹)"],
          grossBill: b["Gross Bill (₹)"],
          netPayable: b["Net Payable (₹)"],
          totalReceived: b["Total Received (₹)"],
          outstanding: b["Outstanding Balance (₹)"],
          seedName: state.seeds.find(s => s.seedId === b["Seed Name (Seed_ID)"])?.name || "Seed"
        });
      }
      
      showToast("Import Complete!");
    } catch(err) {
      console.error(err);
      showToast("Import failed. See console.");
    }
  }


  /* ============ UI UTILS ============ */
  function closeModals(e) {
    if (e && e.target.id !== 'addModalOverlay') return;
    document.getElementById('addModalOverlay')?.classList.remove('open');
  }

  function showToast(msg) {
    let t = document.getElementById('toastMsg');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toastMsg';
      t.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#333; color:#fff; padding:10px 20px; border-radius:20px; font-size:14px; z-index:9999; transition:opacity 0.3s;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    setTimeout(() => { t.style.opacity = '0'; }, 3000);
  }

  function formatCurrency(num) {
    if (!num && num !== 0) return '₹0';
    return '₹' + Number(num).toLocaleString('en-IN');
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.toString().replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  function bindEvents() {
    const tBtn = document.getElementById('themeToggle');
    if(tBtn) {
      tBtn.addEventListener('click', () => {
        const root = document.documentElement;
        if (root.getAttribute('data-theme') === 'dark') {
          root.removeAttribute('data-theme');
        } else {
          root.setAttribute('data-theme', 'dark');
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    switchView,
    openAddCompanyModal,
    openAddSeedModal,
    openAddPartyModal,
    openPartyDetailModal,
    closeModals,
    onBillingCompanyChange,
    importDatabase
  };

})();
