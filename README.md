# Bankwise Pro Dash

Build a complete, modern, professional **Bank Management System using C++ OOP concepts** for a college OOP project presentation.

### 1. Project Requirements

Create a fully functional, responsive banking web application with a beautiful, premium-looking UI. Keep the project simple, easy to understand, and suitable for a beginner-level college project. Prioritize a working frontend, smooth interactions, and clean design.

### 2. UI Design

- Use a modern banking dashboard design with a navy blue, white, and soft blue color palette.

- Create a professional sidebar, top navigation bar, dashboard cards, clean tables, and attractive forms.

- Add a bank logo/icon, subtle shadows, rounded cards, smooth hover effects, and tasteful animations.

- Make the interface responsive on desktop, tablet, and mobile.

- Use readable typography, consistent spacing, clear labels, and appropriate icons.

- Avoid clutter and unnecessary complex features.

### 3. Dashboard

Display:

- Total number of accounts

- Total deposits across all accounts

- Total withdrawals

- Recent transactions

- A simple transaction summary chart if practical

Update dashboard statistics automatically whenever transactions or accounts change.

### 4. Functional Features

Implement these features with working buttons and proper validation:

1. **Dashboard:** Display account statistics and recent activity.

2. **Create Account:** Form fields for account holder name, account number, account type (Savings or Current), and initial deposit.

3. **View Accounts:** Display all accounts in a searchable table with account number, holder name, account type, and balance.

4. **Account Details:** View an individual account's details and transaction history.

5. **Deposit Money:** Select an account, enter an amount, validate it, and update the balance.

6. **Withdraw Money:** Select an account, enter an amount, prevent invalid withdrawals and insufficient-balance withdrawals, and update the balance.

7. **Transfer Money:** Transfer funds between two existing accounts, checking the balance and updating both accounts correctly.

8. **Transaction History:** Display deposits, withdrawals, and transfers with transaction type, amount, date, and account details.

9. **Search:** Search accounts by account number or account holder name.

10. **Notifications:** Show clear success and error messages after every action.

11. **Delete Account:** Allow deletion only when appropriate, with a confirmation dialog.

12. **Reset/Demo Data:** Provide a safe way to restore sample data for demonstrations.

### 5. C++ OOP Concepts

This is an OOP subject project, so structure the underlying project logic around these C++ concepts:

- Classes and Objects

- Encapsulation using private data members and public methods

- Inheritance using a base Account class and derived SavingsAccount and CurrentAccount classes

- Polymorphism using virtual functions and function overriding

- Constructors

- Function Overloading

- Static Data Members to count accounts

- Arrays or collections of account objects

- File Handling to save and load account information

- Exception Handling for invalid transactions and insufficient balance

Provide a separate, properly organized, beginner-friendly C++ console implementation that genuinely demonstrates these OOP concepts. Include comments and meaningful class and function names so a student can explain the code during a viva.

**Important:** Do not claim that the web frontend itself uses C++ if it uses JavaScript or TypeScript. Keep the C++ OOP implementation separate and clearly identify it as the C++ project logic.

### 6. Technical Requirements

- Use React and TypeScript for the frontend.

- Use reusable components and clean, organized code.

- Make every button, form, navigation link, search field, and action functional.

- Use realistic sample data so the app looks complete on first launch.

- Persist changes using localStorage so accounts and transactions remain after refreshing the page.

- Validate all forms and prevent duplicate account numbers, negative amounts, zero-value transactions, and insufficient-balance withdrawals.

- Handle errors gracefully.

- Do not add non-functional placeholder buttons.

- Do not require paid APIs or external API keys.

- Do not build a complicated authentication system or unnecessary admin modules.

### 7. Final Quality Check

Before finishing, test the main user flow:

Create an account → View account → Deposit money → Withdraw money → Transfer money → View updated balance → Check transaction history → Refresh the page and verify that data persists.

Fix any broken buttons, incorrect balance calculations, UI issues, or runtime errors.

The final result should be a polished, attractive, fully working banking frontend suitable for a college presentation, with a separate C++ source code implementation demonstrating OOP concepts.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bankwise-pro-dash.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/19ec6ea7-7865-557c-b9de-7248daa70c98).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
