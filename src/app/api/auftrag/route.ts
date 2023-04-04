import { db } from "@/firebase/config";
import { convertFirestoreDate } from "@/helpers/convertFirestoreDate";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const docs = (await getDocs(collection(db, "auftrag"))).docs;
    const auftrag = docs.map((doc) => ({
      ...doc.data(),
      createdAt: convertFirestoreDate(doc.data().createdAt),
      deliveryDate: convertFirestoreDate(doc.data().deliveryDate),
      desiredDeliveryDate: convertFirestoreDate(doc.data().desiredDeliveryDate),
      anfragenDate: convertFirestoreDate(doc.data().anfragenDate),
    }));
    return NextResponse.json({ auftrag });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
