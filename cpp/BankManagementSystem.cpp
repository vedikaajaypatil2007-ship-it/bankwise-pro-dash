/*
 * ============================================================
 *  BANK MANAGEMENT SYSTEM  -  C++ OOP Project (Console Version)
 * ============================================================
 *  This is the C++ project logic. The web dashboard is a separate
 *  React + TypeScript frontend that mirrors the same rules.
 *
 *  OOP concepts demonstrated:
 *   1. Classes & Objects        -> Account, SavingsAccount, CurrentAccount, Bank
 *   2. Encapsulation            -> private/protected data + public methods
 *   3. Inheritance              -> SavingsAccount & CurrentAccount derive from Account
 *   4. Polymorphism             -> virtual withdraw(), getType(), display()
 *   5. Constructors/Destructor  -> parameterised constructors, virtual destructor
 *   6. Function Overloading     -> deposit(double) / deposit(double, string)
 *                                  findAccount(int) / findAccount(string)
 *   7. Static Data Members      -> Account::totalAccounts
 *   8. Collections of objects   -> vector<Account*>
 *   9. File Handling            -> saveToFile() / loadFromFile() using fstream
 *  10. Exception Handling       -> custom BankException, try / catch / throw
 *
 *  Compile:  g++ -std=c++17 BankManagementSystem.cpp -o bank
 *  Run:      ./bank
 * ============================================================
 */

#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <string>
#include <stdexcept>
#include <iomanip>
#include <limits>
using namespace std;

// ------------------------------------------------------------
// Custom exception class (Exception Handling + Inheritance)
// ------------------------------------------------------------
class BankException : public runtime_error {
public:
    explicit BankException(const string& msg) : runtime_error(msg) {}
};

class InsufficientBalanceException : public BankException {
public:
    InsufficientBalanceException()
        : BankException("Insufficient balance for this transaction!") {}
};

// ------------------------------------------------------------
// Base class: Account  (Abstract class)
// ------------------------------------------------------------
class Account {
private:
    int accountNumber;          // Encapsulation: hidden from outside
    string holderName;

protected:
    double balance;             // protected: derived classes may use it

public:
    static int totalAccounts;   // Static data member shared by all objects

    // Parameterised constructor
    Account(int accNo, const string& name, double initialDeposit)
        : accountNumber(accNo), holderName(name), balance(initialDeposit) {
        if (initialDeposit < 0)
            throw BankException("Initial deposit cannot be negative.");
        totalAccounts++;
    }

    // Virtual destructor so derived objects are destroyed correctly
    virtual ~Account() { totalAccounts--; }

    // ---- Getters (public interface to private data) ----
    int getAccountNumber() const { return accountNumber; }
    string getHolderName() const { return holderName; }
    double getBalance() const { return balance; }

    // ---- Function Overloading: two versions of deposit ----
    void deposit(double amount) {
        if (amount <= 0)
            throw BankException("Deposit amount must be greater than zero.");
        balance += amount;
    }
    void deposit(double amount, const string& remark) {
        deposit(amount);  // reuse the first version
        cout << "  Remark: " << remark << endl;
    }

    // ---- Pure virtual functions (Polymorphism) ----
    virtual void withdraw(double amount) = 0;
    virtual string getType() const = 0;

    // Virtual function with a default implementation
    virtual void display() const {
        cout << left << setw(10) << accountNumber
             << setw(20) << holderName
             << setw(10) << getType()
             << right << setw(12) << fixed << setprecision(2) << balance << endl;
    }
};

// Definition of the static member (outside the class)
int Account::totalAccounts = 0;

// ------------------------------------------------------------
// Derived class: SavingsAccount
// ------------------------------------------------------------
class SavingsAccount : public Account {
private:
    static constexpr double MIN_BALANCE = 1000.0;

public:
    SavingsAccount(int accNo, const string& name, double initial)
        : Account(accNo, name, initial) {          // call base constructor
        if (initial < MIN_BALANCE)
            throw BankException("Savings account needs at least Rs.1000 initial deposit.");
    }

    // Function overriding: savings must keep a minimum balance
    void withdraw(double amount) override {
        if (amount <= 0)
            throw BankException("Withdrawal amount must be greater than zero.");
        if (balance - amount < MIN_BALANCE)
            throw InsufficientBalanceException();
        balance -= amount;
    }

    string getType() const override { return "Savings"; }
};

// ------------------------------------------------------------
// Derived class: CurrentAccount
// ------------------------------------------------------------
class CurrentAccount : public Account {
public:
    CurrentAccount(int accNo, const string& name, double initial)
        : Account(accNo, name, initial) {}

    // Function overriding: current account can go down to zero
    void withdraw(double amount) override {
        if (amount <= 0)
            throw BankException("Withdrawal amount must be greater than zero.");
        if (amount > balance)
            throw InsufficientBalanceException();
        balance -= amount;
    }

    string getType() const override { return "Current"; }
};

// ------------------------------------------------------------
// Bank class: manages a collection of Account objects
// ------------------------------------------------------------
class Bank {
private:
    vector<Account*> accounts;          // collection of base-class pointers
    const string fileName = "accounts.txt";

    // Factory helper: creates the correct derived object
    Account* makeAccount(const string& type, int no, const string& name, double bal) {
        if (type == "Savings") return new SavingsAccount(no, name, bal);
        return new CurrentAccount(no, name, bal);
    }

public:
    Bank() { loadFromFile(); }          // constructor loads saved data
    ~Bank() {                           // destructor saves & frees memory
        saveToFile();
        for (Account* a : accounts) delete a;
    }

    // ---- Function Overloading: search by number OR by name ----
    Account* findAccount(int accNo) {
        for (Account* a : accounts)
            if (a->getAccountNumber() == accNo) return a;
        return nullptr;
    }
    Account* findAccount(const string& name) {
        for (Account* a : accounts)
            if (a->getHolderName() == name) return a;
        return nullptr;
    }

    void createAccount(int accNo, const string& name, int typeChoice, double initial) {
        if (findAccount(accNo) != nullptr)
            throw BankException("Account number already exists.");
        string type = (typeChoice == 1) ? "Savings" : "Current";
        accounts.push_back(makeAccount(type, accNo, name, initial));
        cout << "  Account created successfully!\n";
    }

    void depositMoney(int accNo, double amount) {
        Account* a = getOrThrow(accNo);
        a->deposit(amount);
        cout << "  Deposited. New balance: " << a->getBalance() << endl;
    }

    void withdrawMoney(int accNo, double amount) {
        Account* a = getOrThrow(accNo);
        a->withdraw(amount);            // polymorphic call
        cout << "  Withdrawn. New balance: " << a->getBalance() << endl;
    }

    void transferMoney(int fromNo, int toNo, double amount) {
        if (fromNo == toNo) throw BankException("Cannot transfer to the same account.");
        Account* from = getOrThrow(fromNo);
        Account* to = getOrThrow(toNo);
        from->withdraw(amount);         // throws if balance is insufficient
        to->deposit(amount);
        cout << "  Transfer successful!\n";
    }

    void deleteAccount(int accNo) {
        for (size_t i = 0; i < accounts.size(); i++) {
            if (accounts[i]->getAccountNumber() == accNo) {
                if (accounts[i]->getBalance() > 0)
                    throw BankException("Withdraw the balance before deleting the account.");
                delete accounts[i];
                accounts.erase(accounts.begin() + i);
                cout << "  Account deleted.\n";
                return;
            }
        }
        throw BankException("Account not found.");
    }

    void showAll() const {
        cout << "\n" << left << setw(10) << "AccNo" << setw(20) << "Holder"
             << setw(10) << "Type" << right << setw(12) << "Balance" << endl;
        cout << string(52, '-') << endl;
        for (const Account* a : accounts) a->display();   // polymorphism
        cout << "Total accounts: " << Account::totalAccounts << endl;
    }

    // ---- File Handling ----
    void saveToFile() const {
        ofstream out(fileName);
        for (const Account* a : accounts)
            out << a->getAccountNumber() << "|" << a->getHolderName() << "|"
                << a->getType() << "|" << a->getBalance() << "\n";
    }

    void loadFromFile() {
        ifstream in(fileName);
        if (!in) return;                // first run: no file yet
        string line;
        while (getline(in, line)) {
            stringstream ss(line);
            string no, name, type, bal;
            getline(ss, no, '|'); getline(ss, name, '|');
            getline(ss, type, '|'); getline(ss, bal, '|');
            try {
                accounts.push_back(makeAccount(type, stoi(no), name, stod(bal)));
            } catch (...) { /* skip corrupted line */ }
        }
    }

private:
    Account* getOrThrow(int accNo) {
        Account* a = findAccount(accNo);
        if (!a) throw BankException("Account not found.");
        return a;
    }
};

// ------------------------------------------------------------
// Input helpers
// ------------------------------------------------------------
template <typename T>
T readValue(const string& prompt) {
    T value;
    while (true) {
        cout << prompt;
        if (cin >> value) return value;
        cout << "  Invalid input, try again.\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }
}

// ------------------------------------------------------------
// main(): menu-driven program
// ------------------------------------------------------------
int main() {
    Bank bank;   // object of Bank class
    int choice;

    do {
        cout << "\n===== BANK MANAGEMENT SYSTEM =====\n"
             << "1. Create Account\n2. Deposit\n3. Withdraw\n4. Transfer\n"
             << "5. Show All Accounts\n6. Search Account\n7. Delete Account\n0. Exit\n";
        choice = readValue<int>("Enter choice: ");

        try {
            switch (choice) {
            case 1: {
                int no = readValue<int>("Account number: ");
                cout << "Holder name: ";
                cin.ignore();
                string name; getline(cin, name);
                int type = readValue<int>("Type (1 = Savings, 2 = Current): ");
                double amt = readValue<double>("Initial deposit: ");
                bank.createAccount(no, name, type, amt);
                break;
            }
            case 2: bank.depositMoney(readValue<int>("Account number: "), readValue<double>("Amount: ")); break;
            case 3: bank.withdrawMoney(readValue<int>("Account number: "), readValue<double>("Amount: ")); break;
            case 4: {
                int from = readValue<int>("From account: ");
                int to = readValue<int>("To account: ");
                bank.transferMoney(from, to, readValue<double>("Amount: "));
                break;
            }
            case 5: bank.showAll(); break;
            case 6: {
                Account* a = bank.findAccount(readValue<int>("Account number: "));
                if (a) a->display(); else cout << "  Account not found.\n";
                break;
            }
            case 7: bank.deleteAccount(readValue<int>("Account number: ")); break;
            case 0: cout << "Data saved. Goodbye!\n"; break;
            default: cout << "  Invalid choice.\n";
            }
            bank.saveToFile();
        }
        catch (const InsufficientBalanceException& e) {   // most specific first
            cout << "  ERROR: " << e.what() << endl;
        }
        catch (const BankException& e) {
            cout << "  ERROR: " << e.what() << endl;
        }
    } while (choice != 0);

    return 0;
}
