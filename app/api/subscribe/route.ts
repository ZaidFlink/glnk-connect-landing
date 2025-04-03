import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase';

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
    
    console.log('Checking for existing email in Supabase:', email);
    
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
      console.log('Email already exists:', email);
      return NextResponse.json(
        { success: true, message: 'Already subscribed' }, 
        { status: 200 }
      );
    }
    
    console.log('Inserting new email subscription:', email);
    
    // Insert new email subscription into Supabase
    const { error: insertError } = await supabase
      .from('Email Subscriptions')
      .insert([{ email }]);
    
    if (insertError) {
      console.error('Error inserting subscription:', insertError);
      return NextResponse.json(
        { error: `Failed to save subscription: ${insertError.message}` }, 
        { status: 500 }
      );
    }
    
    console.log('Email subscription stored successfully:', email);
    
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

export async function GET(req: NextRequest) {
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
    
    // Extract just the email strings
    const emails = data?.map(sub => sub.email) || [];
    
    return NextResponse.json(
      { 
        success: true, 
        count: count || 0,
        subscriptions: emails,
        debug: { data, error } // Include raw data for debugging
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