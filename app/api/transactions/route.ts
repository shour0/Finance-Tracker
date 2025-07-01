// app/api/transactions/route.ts
import { Transaction } from "@/types/transaction";
import { admin } from "@/lib/firebase.admin";
import { NextRequest, NextResponse } from "next/server";
import { CollectionReference, DocumentData, Query, FieldValue, Timestamp } from 'firebase-admin/firestore';

// GET handler 
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    
    // Get Firestore instance
    const db = admin.firestore();
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    
    let query: CollectionReference<DocumentData> | Query<DocumentData> = db
      .collection('users')
      .doc(uid)
      .collection('transactions');
    
    // Filter by month if provided
    if (month) {
      const [year, monthNum] = month.split('-').map(Number);
      const start = new Date(year, monthNum - 1, 1);
      const end = new Date(year, monthNum, 1);
      query = query.where('date', '>=', start).where('date', '<', end);
    }
    
    // Filter by category if provided
    if (category) {
      query = query.where("category", "==", category);
    }
    
    // Order by date (most recent first)
    query = query.orderBy('date', 'desc');
    
    // Apply limit if provided
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        query = query.limit(limitNum);
      }
    }

    const snapshot = await query.get();
    const transactions: Transaction[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date,
        description: data.description || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('GET Transactions API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST handler 
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    
    // Get request body
    const body = await request.json();
    
    // Validation
    if (
      typeof body.amount !== 'number' ||
      !['income', 'expense'].includes(body.type) || 
      typeof body.category !== 'string' || 
      !body.date
    ) {
      return NextResponse.json({ error: 'Invalid transaction data' }, { status: 400 });
    }
    
    // Get Firestore instance
    const db = admin.firestore();
    
    // Convert date to Firestore Timestamp
    let dateTimestamp: Timestamp;
    if (body.date._seconds) {
      dateTimestamp = Timestamp.fromMillis(body.date._seconds * 1000);
    } else if (typeof body.date === 'string') {
      dateTimestamp = Timestamp.fromDate(new Date(body.date));
    } else {
      dateTimestamp = Timestamp.fromDate(new Date(body.date));
    }

    const newTransaction = {
      amount: body.amount,
      type: body.type,
      date: dateTimestamp,
      category: body.category,
      description: body.description || '',
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db
      .collection('users')
      .doc(uid)
      .collection('transactions')
      .add(newTransaction);
      
    return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error('POST Transaction API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}