# เอกสารความต้องการของระบบ (Software Requirements Specification)
**ชื่อโครงการ:** Personal Finance Tracker (ระบบบันทึกรายรับรายจ่ายส่วนบุคคล)
**เป้าหมาย:** เพื่อสร้างเว็บแอปพลิเคชันสำหรับใช้งานส่วนตัวในการจัดการบัญชีการเงิน บันทึกรายรับ-รายจ่าย รองรับการจัดการหลายบัญชีธนาคาร และสามารถดูสรุปยอดได้จากทุกแพลตฟอร์ม

---

## 1. เทคโนโลยีที่ใช้ (Tech Stack)
*   **Frontend & Backend:** Next.js (App Router หรือ Pages Router)
*   **Language:** TypeScript
*   **Database:** PostgreSQL
*   **ORM (แนะนำ):** Prisma หรือ Drizzle ORM (สำหรับการจัดการ Database Schema)
*   **Infrastructure & Deployment:** 
    *   Docker & Docker Compose (สำหรับการรันแอปพลิเคชันและฐานข้อมูล)
    *   CI/CD Pipeline (เช่น GitHub Actions หรือ GitLab CI) สำหรับการทำ Automated Build และ Deploy ไปยัง Server

---

## 2. การเข้าถึงและการรักษาความปลอดภัย (Access & Security)
*   **Single-User Access:** ระบบถูกออกแบบมาให้ผู้ใช้งานเข้าถึงได้เพียงคนเดียว (Admin/Owner)
*   **Authentication:** มีระบบ Login ที่ปลอดภัย (เช่น ใช้ NextAuth.js หรือกำหนด Username/Password + JWT Session แบบตายตัวสำหรับ 1 User) เพื่อป้องกันบุคคลอื่นเข้าถึงข้อมูล

---

## 3. คุณสมบัติการทำงาน (Functional Requirements)

### 3.1 ระบบจัดการบัญชีธนาคาร (Bank Accounts Management)
*   สามารถเพิ่ม/แก้ไข/ลบ บัญชีธนาคารหรือกระเป๋าเงิน (Wallet) ได้
*   แสดงยอดเงินคงเหลือปัจจุบันของแต่ละบัญชีธนาคาร (Balance per account)
*   แสดงยอดเงินคงเหลือรวมของทุกบัญชีธนาคาร (Total Net Worth)

### 3.2 ระบบบันทึกธุรกรรม (Transaction Management)
*   สามารถบันทึก **รายรับ (Income)** และ **รายจ่าย (Expense)** ได้
*   **ข้อมูลที่ต้องใช้ในการบันทึก:**
    *   วันที่และเวลา (Date & Time)
    *   ประเภท (Type): รายรับ / รายจ่าย
    *   จำนวนเงิน (Amount)
    *   หมวดหมู่ (Category) เช่น อาหาร, เดินทาง, เงินเดือน (Optional แต่ควรมี)
    *   บัญชีธนาคาร (Bank Account) ที่ทำธุรกรรม
    *   บันทึกช่วยจำ (Note/Description)

### 3.3 ระบบแสดงผลและรายงาน (Dashboard & Reports)
*   **ประวัติย้อนหลัง (Transaction History):** สามารถดูรายการธุรกรรมทั้งหมดที่เกิดขึ้นย้อนหลังได้ พร้อมระบบแบ่งหน้า (Pagination) หรือเลื่อนดูแบบ (Infinite Scroll)
*   **สรุปรายวัน (Daily Summary):** แสดงยอดรวมรายรับและรายจ่ายในแต่ละวัน
*   **สรุปรายเดือน (Monthly Summary):** แสดงยอดรวมรายรับ ยอดรวมรายจ่าย และเงินคงเหลือประจำเดือน 

---

## 4. คุณสมบัติที่ไม่ใช่การทำงาน (Non-Functional Requirements)
*   **Cross-Platform (Responsive Design):** หน้าเว็บต้องแสดงผลได้ดีและใช้งานได้ง่ายบนทุกหน้าจอ (มือถือ, แท็บเล็ต, คอมพิวเตอร์)
*   **Performance:** โหลดข้อมูลรวดเร็ว (อาจพิจารณาใช้ SSR/SSG ของ Next.js ให้เกิดประโยชน์สูงสุด)
*   **Reliability:** ข้อมูลต้องไม่สูญหายเมื่อระบบล่ม (อาศัยคุณสมบัติของ PostgreSQL)

---

## 5. โครงสร้างฐานข้อมูลเบื้องต้น (Initial Database Schema)

**Table: `Account`** (เก็บบัญชีธนาคาร)
*   `id` (UUID/Int, Primary Key)
*   `name` (String) - ชื่อบัญชี เช่น KBank, SCB, Cash
*   `balance` (Decimal) - ยอดเงินคงเหลือ
*   `createdAt` (DateTime)
*   `updatedAt` (DateTime)

**Table: `Transaction`** (เก็บรายการรายรับ/รายจ่าย)
*   `id` (UUID/Int, Primary Key)
*   `type` (Enum: 'INCOME', 'EXPENSE')
*   `amount` (Decimal) - จำนวนเงิน
*   `description` (String) - รายละเอียด
*   `date` (DateTime) - วันที่เกิดธุรกรรม
*   `accountId` (Foreign Key -> Account.id) - ลิงก์ไปยังบัญชีธนาคาร
*   `createdAt` (DateTime)
*   `updatedAt` (DateTime)

---

## 6. โครงสร้างพื้นฐานและการนำไปใช้งาน (Infrastructure & CI/CD)

### 6.1 Docker
*   มีไฟล์ `Dockerfile` สำหรับการ Build Next.js Application
*   มีไฟล์ `docker-compose.yml` สำหรับรัน Container ของ Next.js Web App และ PostgreSQL Database ไปพร้อมๆ กัน เพื่อความสะดวกในการตั้งค่า Environment

### 6.2 CI/CD Pipeline
*   **Continuous Integration (CI):** 
    *   เมื่อมีการ Push โค้ดไปยัง Branch หลัก ระบบจะทำการรัน Linter, Type checking (TypeScript) และ Build ทดสอบ
*   **Continuous Deployment (CD):** 
    *   เมื่อโค้ดผ่าน CI จะทำการ Build Docker Image และ Push ขึ้น Registry
    *   สั่งให้ Server (เช่น VPS หรือ Cloud Provider) ทำการ Pull Image ใหม่ล่าสุดและรัน `docker-compose up -d` เพื่ออัปเดตแอปพลิเคชันโดยอัตโนมัติแบบ Zero หรือ Low-Downtime