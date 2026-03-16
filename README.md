# Stripe + Supabase SaaS Billing System

A full-stack **SaaS subscription billing system** built to demonstrate real-world payment integration and modern SaaS architecture.

This project showcases how a modern application can handle **user authentication, subscription payments, and billing management** using Stripe and Supabase.

---

## Project Overview

This application simulates a real SaaS platform where users can:

• Sign up and log in securely
• View available subscription plans
• Subscribe to a paid plan using Stripe Checkout
• Access a protected dashboard
• View their subscription status
• Receive confirmation after successful payment

The goal of this project is to demonstrate how a developer can implement a **complete subscription workflow used in production SaaS products**.

---

## Technologies Used

### Frontend

• Next.js (App Router)
• React
• TailwindCSS

### Backend & APIs

• Next.js API Routes
• Stripe API for payment processing
• Stripe Webhooks for event handling

### Authentication & Database

• Supabase Authentication
• Supabase PostgreSQL database

### Payment Infrastructure

• Stripe Checkout for secure payments
• Stripe Webhooks for subscription updates

---

## Key Features

### User Authentication

Users can create an account and securely log in using Supabase authentication.

### Subscription Billing

Stripe Checkout is used to handle subscription payments.

The platform supports:

• Monthly subscription plan
• Secure payment processing
• Automatic billing handling

### Dashboard Access

After login, users can access a protected dashboard where they can see:

• Their account information
• Subscription status
• Payment confirmation

### Webhook Integration

Stripe webhooks are used to detect important events such as:

• Successful checkout sessions
• Subscription updates
• Payment confirmations

These events can be used to update the application database and maintain accurate billing records.

---

## SaaS Architecture Demonstrated

This project demonstrates key concepts used in real SaaS products:

• Secure authentication flow
• Payment gateway integration
• Subscription lifecycle management
• Webhook event handling
• Protected dashboard routes
• Full-stack API architecture

---

## Stripe Test Payment

This project runs in **Stripe Test Mode**, which allows safe testing without real payments.

Test Card:

Card Number: 4242 4242 4242 4242
Expiry Date: Any future date
CVC: Any 3 digits

---

## Why This Project

The goal of this project is to demonstrate my ability to build **production-style SaaS systems** that combine:

• Frontend UI development
• Backend API logic
• Database integration
• Third-party payment infrastructure

This type of architecture is commonly used in modern subscription-based platforms.

---

## Author

Sudipta Halder
