import { db } from "@/firebase/config";
import { convertFirestoreDate } from "@/helpers/convertFirestoreDate";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const docs = (await getDocs(collection(db, "warehouse"))).docs;
    const warehouse = docs.map((doc) => ({
      ...doc.data(),
      date: convertFirestoreDate(doc.data().date),
    }));
    return NextResponse.json({ warehouse });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
