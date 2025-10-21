import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const personnes = await prisma.personne.findMany()
  return NextResponse.json(personnes)
} 