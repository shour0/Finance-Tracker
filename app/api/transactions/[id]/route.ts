import { admin } from '@/lib/firebase.admin'
import { Transaction } from '@/types/transaction';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from "next/server";

async function verifyToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.split(' ')[1]
  if (!token) {
    throw new Error('Unauthorized: No token provided') 
  }
  
  const decodedToken = admin.auth().verifyIdToken(token)
  return (await decodedToken).uid
}

function getTransactionRef(uid: string, transactionId: string) {
  const db = admin.firestore()
  return db.collection('users').doc(uid).collection('transactions').doc(transactionId)
}

// GET handler 
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }>}) {
  try {
    const uid = await verifyToken(request)
    const { id: transactionId } = await params 
    const transactionRef = getTransactionRef(uid, transactionId)

    const doc = await transactionRef.get()

    if(!doc.exists) {
      return NextResponse.json({error: 'Transaction not found'}, {status: 404})
    }

    const data = doc.data()!;
    const transaction: Transaction = {
      id: doc.id,
      amount: data.amount,
      category: data.category,
      type: data.type,
      date: data.date,
      description: data.description || '',
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
    }
  
    return NextResponse.json(transaction)
  } catch (error: unknown) {
    console.error('Transaction API Error:', error);

    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json({ error: error.message}, { status: 401})
      } 
    }
  }
  return NextResponse.json({error: 'Internal server Error'}, { status: 500 })
}

// PUT handler
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }>}) {
  try {
    const uid = await verifyToken(request)
    const { id: transactionId } = await params 

    const body = await request.json()

    
    if (
      typeof body.amount !== 'number' || 
      !['income', 'expense'].includes(body.type) || 
      typeof body.category !== 'string' || 
      !body.date 
    ) {
      return NextResponse.json({error: 'Invalid transaction data'}, { status: 400})
    }
    
    const transactionRef = getTransactionRef(uid, transactionId)

    const doc = await transactionRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Transaction not found'}, { status: 404 })
    }
    
    // convert date to timestamp
    let dateTimestamp: Timestamp;
    if (body.date._seconds) {
      dateTimestamp = Timestamp.fromMillis(body.date._seconds * 1000)
    } else if (typeof body.date === 'string') {
      dateTimestamp = Timestamp.fromDate(new Date(body.date))
    } else {
      dateTimestamp = Timestamp.fromDate(new Date(body.date))
    }
    
    const updateTransaction = {
      amount: body.amount,
      category: body.category,
      description: body.description || '',
      date: dateTimestamp,
      updatedAt: FieldValue.serverTimestamp()
    }

    await transactionRef.update(updateTransaction);

    return NextResponse.json({success: true, id: transactionId})
  } catch(error: unknown) {
    console.error('PUT transaction error:', error)

    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json({ error: error.message }, { status: 401 }) 
      }
    }
  }

  return NextResponse.json({ error: 'Internal Server Error'}, {status: 500})
}

// DELETE handler
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }>}) {
  try {
    const uid = await verifyToken(request)
    const { id: transactionId } = await params 
    const transactionRef = getTransactionRef(uid, transactionId)

    const docs = await transactionRef.get()

    if (!docs.exists) {
      return NextResponse.json({ error: "Transaction not found"}, { status: 404})
    }

    await transactionRef.delete()

    return NextResponse.json({success: true, id: transactionId})
  } catch (error: unknown) {
    console.error('DELETE transaction error', error)

    if (error instanceof Error) {
      if(error.message.includes('Unauthorized')) {
        return NextResponse.json({error: error.message}, { status: 401})
      }
    }
  }
  return NextResponse.json({error: 'Internal Server Error'}, { status: 500 }) 
}