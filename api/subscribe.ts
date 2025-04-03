import { NextRequest, NextResponse } from 'next/server';
import { supabase, SubscriptionInsert, Subscription } from '../utils/supabase';

// Simple in-memory cache for development
// This will be lost on server restart
let cachedEmails: string[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' }, 
        { status: 400 }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' }, 
        { status: 400 }
      );
    }
    
    // Check if email already exists in Supabase
    const { data: existingData, error: checkError } = await supabase
      .from('Email Subscriptions')
      .select('email')
      .eq('email', email)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking for existing email:', checkError);
      return NextResponse.json(
        { error: `Database error: ${checkError.message}` }, 
        { status: 500 }
      );
    }
    
    // If email already exists, return success but don't add it again
    if (existingData) {
      return NextResponse.json(
        { success: true, message: 'Already subscribed' }, 
        { status: 200 }
      );
    }
    
    // Insert new email subscription into Supabase
    const newSubscription: SubscriptionInsert = { email };
    const { error: insertError } = await supabase
      .from('Email Subscriptions')
      .insert(newSubscription);
    
    if (insertError) {
      console.error('Error inserting subscription:', insertError);
      return NextResponse.json(
        { error: `Failed to save subscription: ${insertError.message}` }, 
        { status: 500 }
      );
    }
    
    console.log(`Email subscription received and stored: ${email}`);
    
    return NextResponse.json(
      { success: true, message: 'Subscription successful' }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` }, 
      { status: 500 }
    );
  }
}

// Add a GET endpoint to retrieve the emails (should be protected in production)
export async function GET(req: NextRequest) {
  // In production, you should add authentication here
  // e.g., check for admin token in headers
  
  try {
    console.log('Fetching subscriptions from Supabase...');
    
    // Fetch subscriptions from Supabase
    const { data, error, count } = await supabase
      .from('Email Subscriptions')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error('Error fetching subscriptions:', error);
      return NextResponse.json(
        { error: `Failed to retrieve subscriptions: ${error.message}` }, 
        { status: 500 }
      );
    }
    
    console.log('Fetched subscriptions:', data);
    
    // Extract just the email strings for backward compatibility
    const emails = data?.map(sub => sub.email) || [];
    
    return NextResponse.json(
      { 
        success: true, 
        count: count || 0,
        subscriptions: emails,
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving subscriptions:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` }, 
      { status: 500 }
    );
  }
}