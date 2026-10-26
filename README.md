# Semester III Practical Programs

All 23 questions from the supplied PDF have separate, self-contained folders. The source PDF omits Q21 and Q24.

Quick start on Windows: install Node.js, clone or download this repository, and double-click `INSTALL-ALL.cmd` to install dependencies. Then double-click `START.cmd` in this folder, enter a question number, and keep the program terminals open. Each individual program folder also has its own `START.cmd`. Full-stack programs open a backend terminal and a frontend terminal. Stop both before starting another question.

Prerequisites: Node.js 20.19+ (or 22.12+) and npm. MongoDB programs also require a running MongoDB instance. Double-click `INSTALL-ALL.cmd` to install or restore dependencies for all programs. The installer overrides npm offline mode for that command and reuses cached packages.

React-only records and in-memory API records reset on refresh/server restart respectively. MongoDB records persist.

- [Q1: Employee Management](Programs/Q01_Employee_Management/README.md)
- [Q2: Student Registration](Programs/Q02_Student_Registration/README.md)
- [Q3: Book Management](Programs/Q03_Book_Management/README.md)
- [Q4: Product Entry](Programs/Q04_Product_Entry/README.md)
- [Q5: Feedback Management](Programs/Q05_Feedback_Management/README.md)
- [Q6: College Website](Programs/Q06_College_Website/README.md)
- [Q7: Shopping Portal](Programs/Q07_Shopping_Portal/README.md)
- [Q8: Student Portal](Programs/Q08_Student_Portal/README.md)
- [Q9: Online Bookstore](Programs/Q09_Online_Bookstore/README.md)
- [Q10: Employee MongoDB](Programs/Q10_Employee_MongoDB/README.md)
- [Q11: Product MongoDB](Programs/Q11_Product_MongoDB/README.md)
- [Q12: Student MongoDB](Programs/Q12_Student_MongoDB/README.md)
- [Q13: Book MongoDB](Programs/Q13_Book_MongoDB/README.md)
- [Q14: Customer MongoDB](Programs/Q14_Customer_MongoDB/README.md)
- [Q15: Product REST API](Programs/Q15_Product_REST_API/README.md)
- [Q16: Employee REST API](Programs/Q16_Employee_REST_API/README.md)
- [Q17: Student REST API](Programs/Q17_Student_REST_API/README.md)
- [Q18: Book REST API](Programs/Q18_Book_REST_API/README.md)
- [Q19: User Registration API](Programs/Q19_User_Registration_API/README.md)
- [Q20: Employee Full Stack](Programs/Q20_Employee_Full_Stack/README.md)
- [Q22: Student Management](Programs/Q22_Student_Management/README.md)
- [Q23: Shopping Cart](Programs/Q23_Shopping_Cart/README.md)
- [Q25: Library Management](Programs/Q25_Library_Management/README.md)

## Verification

This repository contains 32 npm packages across 23 programs. Install their dependencies with `INSTALL-ALL.cmd`. All 18 React production builds passed. All 14 backend HTTP checks passed, including live MongoDB persistence and update/delete actions where supported. Temporary test records were removed after verification. MongoDB service was running during verification.

Repeat checks with:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\build-all.ps1
node verify-runtime.mjs
```

Running `verify-runtime.mjs` creates `runtime-results.json` with each backend result. These checks cover builds and HTTP/database behavior; browser interaction was not automated.
