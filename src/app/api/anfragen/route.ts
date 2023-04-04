import { db } from "@/firebase/config";
import { convertFirestoreDate } from "@/helpers/convertFirestoreDate";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const docs = (await getDocs(collection(db, "anfragen"))).docs;
    const anfragen = docs.map((doc) => ({
      ...doc.data(),
      desiredDeliveryDate: convertFirestoreDate(doc.data().desiredDeliveryDate),
      date: convertFirestoreDate(doc.data().date),
      deliveryDate: doc.data().deliveryDate
        ? convertFirestoreDate(doc.data().deliveryDate)
        : "",
    }));
    return NextResponse.json({ anfragen });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
