-- ============================================================
-- 0. PINCODE (Moved to top to prevent FK errors)
-- ============================================================

CREATE TABLE IF NOT EXISTS Pincode (
    Pincode VARCHAR(20) PRIMARY KEY,
    City VARCHAR(100) NOT NULL,
    State VARCHAR(100) NOT NULL
);


-- ============================================================
-- 1. COURSE
-- ============================================================

CREATE TABLE IF NOT EXISTS Course (
    Course_id INT PRIMARY KEY,
    Course_Name VARCHAR(150) NOT NULL,
    Description TEXT,
    Price DECIMAL(10,2),
    No_of_modules INT,
    No_of_weeks INT,
    Material TEXT,
    Category VARCHAR(100) NOT NULL
);


-- ============================================================
-- 3. ASSISTANT (Cycle Breaker: Removed LastSeen_Notification)
-- ============================================================

CREATE TABLE IF NOT EXISTS Assistant (
    Assistant_id INT PRIMARY KEY,
    First_name VARCHAR(100) NOT NULL,
    Last_name VARCHAR(100),
    Aadhar_id VARCHAR(20) UNIQUE,
    DOB DATE,
    Email VARCHAR(255) NOT NULL,
    Credential VARCHAR(255) NOT NULL,
    Sex VARCHAR(20),
    Salary DECIMAL(10,2),
    House_no VARCHAR(50),
    Street VARCHAR(150),
    Pincode VARCHAR(20),

    CONSTRAINT fk_assistant_pincode
        FOREIGN KEY (Pincode)
        REFERENCES Pincode(Pincode)
        ON DELETE SET NULL
);


-- ============================================================
-- 4. ADMIN
-- ============================================================

CREATE TABLE IF NOT EXISTS Admin (
    Admin_id INT PRIMARY KEY,
    First_name VARCHAR(100) NOT NULL,
    Last_name VARCHAR(100),
    Aadhar_id VARCHAR(20) UNIQUE,
    DOB DATE,
    Email VARCHAR(255) NOT NULL,
    Credential VARCHAR(255) NOT NULL,
    Sex VARCHAR(20),
    House_no VARCHAR(50),
    Street VARCHAR(150),
    Pincode VARCHAR(20),
    
    CONSTRAINT fk_Admin_pincode
        FOREIGN KEY (Pincode)
        REFERENCES Pincode(Pincode)
        ON DELETE SET NULL
);


-- ============================================================
-- 5. GLOBAL NOTIFICATION
-- ============================================================

CREATE TABLE IF NOT EXISTS GlobalNotification (
    Notification_id INT PRIMARY KEY,
    Assistant_id INT NOT NULL,
    Notification_date DATE NOT NULL,
    Notification_time TIME NOT NULL,
    Notification_title VARCHAR(255) NOT NULL,
    Description TEXT NOT NULL,

    CONSTRAINT fk_globalnotification_assistant
        FOREIGN KEY (Assistant_id)
        REFERENCES Assistant(Assistant_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 5B. ASSISTANT LAST SEEN NOTIFICATION (Cycle Breaker Table)
-- ============================================================

CREATE TABLE IF NOT EXISTS Assistant_LastSeen_Notification (
    Assistant_id INT PRIMARY KEY,
    LastSeen_Global_Notification_id INT,

    CONSTRAINT fk_aln_assistant
        FOREIGN KEY (Assistant_id)
        REFERENCES Assistant(Assistant_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_aln_global_notification
        FOREIGN KEY (LastSeen_Global_Notification_id)
        REFERENCES GlobalNotification(Notification_id)
        ON DELETE SET NULL
);


-- ============================================================
-- 2. TEACHER
-- ============================================================

CREATE TABLE IF NOT EXISTS Teacher (
    Teacher_id INT PRIMARY KEY,
    First_name VARCHAR(100) NOT NULL,
    Last_name VARCHAR(100),
    DOB DATE,
    Sex VARCHAR(20),
    Email VARCHAR(255) NOT NULL,
    Credential VARCHAR(255) NOT NULL,
    Salary DECIMAL(10,2),
    Joining_date DATE NOT NULL,
    House_no VARCHAR(50),
    Street VARCHAR(150),
    Pincode VARCHAR(20),
    Aadhar_id VARCHAR(20) UNIQUE,
    LastSeen_Global_Notification_id INT,

    CONSTRAINT fk_teacher_global_notification
        FOREIGN KEY (LastSeen_Global_Notification_id)
        REFERENCES GlobalNotification(Notification_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_teacher_pincode
        FOREIGN KEY (Pincode)
        REFERENCES Pincode(Pincode)
        ON DELETE SET NULL
);


-- ============================================================
-- 6. STUDENT
-- ============================================================

CREATE TABLE IF NOT EXISTS Student (
    Student_id INT PRIMARY KEY,
    First_name VARCHAR(100) NOT NULL,
    Last_name VARCHAR(100),
    Sex VARCHAR(20),
    DOB DATE,
    Credential VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    House_no VARCHAR(50),
    Street VARCHAR(150),
    Pincode VARCHAR(20),
    Aadhar_id VARCHAR(20) UNIQUE,
    LastSeen_Global_Notification_id INT,

    CONSTRAINT fk_student_global_notification
        FOREIGN KEY (LastSeen_Global_Notification_id)
        REFERENCES GlobalNotification(Notification_id)
        ON DELETE SET NULL,
    
    CONSTRAINT fk_student_pincode
        FOREIGN KEY (Pincode)
        REFERENCES Pincode(Pincode)
        ON DELETE SET NULL
);


-- ============================================================
-- 9. STUDENT CONTACTS
-- ============================================================

CREATE TABLE IF NOT EXISTS Student_Contacts (
    Student_id INT,
    Phone_no VARCHAR(20),

    PRIMARY KEY (Student_id, Phone_no),

    CONSTRAINT fk_student_contacts_student
        FOREIGN KEY (Student_id)
        REFERENCES Student(Student_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 10. STUDENT COMPLAINTS
-- ============================================================

CREATE TABLE IF NOT EXISTS Student_Complaints (
    Complaint_id INT,
    Student_id INT,
    PRIMARY KEY(Complaint_id,Student_id),
    Title VARCHAR(255) NOT NULL,
    Complaint_date DATE NOT NULL,
    Complaint_time TIME NOT NULL,
    Complaint_description TEXT,

    CONSTRAINT fk_student_complaints_student
        FOREIGN KEY (Student_id)
        REFERENCES Student(Student_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 11. BATCH
-- ============================================================

CREATE TABLE IF NOT EXISTS Batch (
    Batch_id INT PRIMARY KEY,
    Teacher_id INT,           -- REMOVED "NOT NULL" HERE
    Course_id INT NOT NULL,
    Start_date DATE,
    Start_time TIME,
    End_time TIME,
    Venue VARCHAR(255),
    Modules_Completed INT DEFAULT 0,

    CONSTRAINT fk_batch_teacher
        FOREIGN KEY (Teacher_id)
        REFERENCES Teacher(Teacher_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_batch_course
        FOREIGN KEY (Course_id)
        REFERENCES Course(Course_id)
        ON DELETE CASCADE
);

-- ============================================================
-- 12. STUDENT ATTENDANCE
-- ============================================================

CREATE TABLE IF NOT EXISTS Student_Attendance (
    Date DATE,
    Student_id INT,
    Batch_id INT,
    Status INT CHECK (Status IN (0,1)),

    PRIMARY KEY (Date, Student_id, Batch_id),

    CONSTRAINT fk_student_attendance_student
        FOREIGN KEY (Student_id)
        REFERENCES Student(Student_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_student_attendance_batch
        FOREIGN KEY (Batch_id)
        REFERENCES Batch(Batch_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 13. ENROLLMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS Enrollment (
    Student_id INT,
    Batch_id INT,
    PRIMARY KEY (Student_id, Batch_id),

    Batch_Notification_Status BOOLEAN,
    Enrollment_date DATE NOT NULL,
    Feedback TEXT,
    Certificate VARCHAR(255),
    Discount DECIMAL(5,2) DEFAULT 0.00,

    CONSTRAINT fk_enrollment_student
        FOREIGN KEY (Student_id)
        REFERENCES Student(Student_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_enrollment_batch
        FOREIGN KEY (Batch_id)
        REFERENCES Batch(Batch_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 14. SCHEDULE
-- ============================================================

CREATE TABLE IF NOT EXISTS Schedule (
    Day VARCHAR(20),
    Batch_id INT,

    PRIMARY KEY (Day, Batch_id),

    CONSTRAINT fk_schedule_batch
        FOREIGN KEY (Batch_id)
        REFERENCES Batch(Batch_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 15. BATCH NOTIFICATION
-- ============================================================

CREATE TABLE IF NOT EXISTS Batch_Notification (
    Notification_id INT,
    Batch_id INT,
    PRIMARY KEY(Notification_id,Batch_id),
    Description TEXT,
    Title VARCHAR(255) NOT NULL,

    CONSTRAINT fk_batch_notification_batch
        FOREIGN KEY (Batch_id)
        REFERENCES Batch(Batch_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 16. TEST
-- ============================================================

CREATE TABLE IF NOT EXISTS Test (
    Test_id INT,
    Batch_id INT,
    PRIMARY KEY(Test_id,Batch_id),
    Test_title VARCHAR(255) NOT NULL,
    Date DATE,
    Question_paper_Link VARCHAR(500),
    Answerkey_Link VARCHAR(500),

    CONSTRAINT fk_test_batch
        FOREIGN KEY (Batch_id)
        REFERENCES Batch(Batch_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 17. TEACHER CONTACTS
-- ============================================================

CREATE TABLE IF NOT EXISTS Teacher_Contacts (
    Teacher_id INT,
    Phone_no VARCHAR(20),

    PRIMARY KEY (Teacher_id, Phone_no),

    CONSTRAINT fk_teacher_contacts_teacher
        FOREIGN KEY (Teacher_id)
        REFERENCES Teacher(Teacher_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 18. TEACHER ATTENDANCE RECORD
-- ============================================================

CREATE TABLE IF NOT EXISTS Teacher_Attendance_Record (
    Date DATE,
    Teacher_id INT,
    Status DECIMAL(2,1) CHECK (Status IN (0,0.5,1)),

    PRIMARY KEY (Date, Teacher_id),

    CONSTRAINT fk_teacher_attendance_teacher
        FOREIGN KEY (Teacher_id)
        REFERENCES Teacher(Teacher_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 19. TEACHER COMPLAINTS
-- ============================================================

CREATE TABLE IF NOT EXISTS Teacher_Complaints (
    Complaint_id INT,
    Teacher_id INT,
    PRIMARY KEY(Complaint_id,Teacher_id),
    Title VARCHAR(255) NOT NULL,
    Complaint_date DATE NOT NULL,
    Complaint_time TIME NOT NULL,
    Complaint_description TEXT,

    CONSTRAINT fk_teacher_complaints_teacher
        FOREIGN KEY (Teacher_id)
        REFERENCES Teacher(Teacher_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 20. COURSE MODULE
-- ============================================================

CREATE TABLE IF NOT EXISTS Course_Module (
    Module_id INT,
    Course_id INT,
    PRIMARY KEY (Module_id, Course_id),

    Module_title VARCHAR(255) NOT NULL,
    Module_description TEXT,

    CONSTRAINT fk_course_module_course
        FOREIGN KEY (Course_id)
        REFERENCES Course(Course_id) 
        ON DELETE CASCADE
);


-- ============================================================
-- 21. TEACHER SALARY RECORDS
-- ============================================================

CREATE TABLE IF NOT EXISTS Teacher_Salary_Records (
    Receipt_id INT PRIMARY KEY,
    Teacher_id INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Salary_payment_date DATE NOT NULL,
    Month INT NOT NULL,
    Year INT NOT NULL,

    CONSTRAINT fk_teacher_salary_teacher
        FOREIGN KEY (Teacher_id)
        REFERENCES Teacher(Teacher_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 22. TEACHER SALARY DETAILS
-- ============================================================

CREATE TABLE IF NOT EXISTS Teacher_Salary_Details (
    Receipt_id INT,
    Description VARCHAR(255), 

    PRIMARY KEY (Receipt_id, Description),

    CONSTRAINT fk_teacher_salary_details
        FOREIGN KEY (Receipt_id)
        REFERENCES Teacher_Salary_Records(Receipt_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 23. ASSISTANT ATTENDANCE RECORD
-- ============================================================

CREATE TABLE IF NOT EXISTS Assistant_Attendance_Record (
    Date DATE,
    Assistant_id INT,
    Status DECIMAL(2,1) CHECK (STATUS IN (0,0.5,1)),

    PRIMARY KEY (Date, Assistant_id),

    CONSTRAINT fk_assistant_attendance
        FOREIGN KEY (Assistant_id)
        REFERENCES Assistant(Assistant_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 24. ASSISTANT CONTACTS
-- ============================================================

CREATE TABLE IF NOT EXISTS Assistant_Contacts (
    Assistant_id INT,
    Phone_no VARCHAR(20), 

    PRIMARY KEY (Assistant_id, Phone_no),

    CONSTRAINT fk_assistant_contacts
        FOREIGN KEY (Assistant_id)
        REFERENCES Assistant(Assistant_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 25. ASSISTANT COMPLAINTS
-- ============================================================

CREATE TABLE IF NOT EXISTS Assistant_Complaints (
    Complaint_id INT,
    Assistant_id INT,
    PRIMARY KEY(Complaint_id,Assistant_id),
    Complaint_description TEXT, 
    Complaint_Title TEXT NOT NULL,
    Complaint_date DATE NOT NULL,    
    Complaint_time TIME NOT NULL,    

    CONSTRAINT fk_assistant_complaints
        FOREIGN KEY (Assistant_id)
        REFERENCES Assistant(Assistant_id)
);


-- ============================================================
-- 26. ADMIN CONTACTS
-- ============================================================

CREATE TABLE IF NOT EXISTS Admin_Contacts (
    Admin_id INT,
    Phone_no VARCHAR(20), 

    PRIMARY KEY (Admin_id, Phone_no),

    CONSTRAINT fk_admin_contacts
        FOREIGN KEY (Admin_id)
        REFERENCES Admin(Admin_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 27. FEE PAYMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS Fee_Payment (
    Receipt_id INT PRIMARY KEY,
    Student_id INT NOT NULL,
    Batch_id INT NOT NULL,   
    Amount DECIMAL(10,2) NOT NULL, 
    Payment_date DATE NOT NULL,      
    Payment_time TIME NOT NULL,  
    Mode_of_payment VARCHAR(50) NOT NULL, 

    CONSTRAINT fk_fee_payment_student
        FOREIGN KEY (Student_id)
        REFERENCES Student(Student_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_fee_payment_batch
        FOREIGN KEY (Batch_id)
        REFERENCES Batch(Batch_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 28. FEE DETAILS
-- ============================================================

CREATE TABLE IF NOT EXISTS Fee_Details (
    Receipt_id INT,
    Description VARCHAR(255),

    PRIMARY KEY (Receipt_id, Description),

    CONSTRAINT fk_fee_details
        FOREIGN KEY (Receipt_id)
        REFERENCES Fee_Payment(Receipt_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 29. ASSISTANT SALARY RECORDS
-- ============================================================

CREATE TABLE IF NOT EXISTS Assistant_Salary_Records (
    Receipt_id INT PRIMARY KEY,
    Assistant_id INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,   
    Salary_payment_date DATE NOT NULL,   
    Month INT NOT NULL,  
    Year INT NOT NULL,   

    CONSTRAINT fk_assistant_salary_assistant    
        FOREIGN KEY (Assistant_id)
        REFERENCES Assistant(Assistant_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 30. ASSISTANT SALARY DETAILS
-- ============================================================

CREATE TABLE IF NOT EXISTS Assistant_Salary_Details (
    Receipt_id INT,
    Description VARCHAR(255), 

    PRIMARY KEY (Receipt_id, Description),

    CONSTRAINT fk_assistant_salary_details
        FOREIGN KEY (Receipt_id)
        REFERENCES Assistant_Salary_Records(Receipt_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 31. TAKES
-- ============================================================

CREATE TABLE IF NOT EXISTS Takes (
    Student_id INT,
    Batch_id INT,
    Test_id INT,
    Score DECIMAL(5,2),         

    PRIMARY KEY (Student_id, Batch_id, Test_id),

    CONSTRAINT fk_takes_student
        FOREIGN KEY (Student_id)
        REFERENCES Student(Student_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_takes_test
        FOREIGN KEY (Test_id,Batch_id)
        REFERENCES Test(Test_id,Batch_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 32. STUDENT MIDDLE NAME
-- ============================================================

CREATE TABLE IF NOT EXISTS Student_Middle_Name (
    Sequence_No INT,
    Student_id INT,
    Middle_Name VARCHAR(100) NOT NULL,

    PRIMARY KEY (Sequence_No, Student_id),

    CONSTRAINT fk_student_middle_name_student
        FOREIGN KEY (Student_id)
        REFERENCES Student(Student_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 33. TEACHER MIDDLE NAME
-- ============================================================

CREATE TABLE IF NOT EXISTS Teacher_Middle_Name (
    Sequence_No INT,
    Teacher_id INT,
    Middle_Name VARCHAR(100) NOT NULL,

    PRIMARY KEY (Sequence_No, Teacher_id),

    CONSTRAINT fk_teacher_middle_name_teacher
        FOREIGN KEY (Teacher_id)
        REFERENCES Teacher(Teacher_id)
);


-- ============================================================
-- 34. ASSISTANT MIDDLE NAME
-- ============================================================

CREATE TABLE IF NOT EXISTS Assistant_Middle_Name (
    Sequence_No INT,
    Assistant_id INT,
    Middle_Name VARCHAR(100) NOT NULL,

    PRIMARY KEY (Sequence_No, Assistant_id),

    CONSTRAINT fk_assistant_middle_name
        FOREIGN KEY (Assistant_id)
        REFERENCES Assistant(Assistant_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 35. ADMIN MIDDLE NAME
-- ============================================================

CREATE TABLE IF NOT EXISTS Admin_Middle_Name (
    Sequence_No INT,
    Admin_id INT,
    Middle_Name VARCHAR(100) NOT NULL,

    PRIMARY KEY (Sequence_No, Admin_id),

    CONSTRAINT fk_admin_middle_name
        FOREIGN KEY (Admin_id)
        REFERENCES Admin(Admin_id)
        ON DELETE CASCADE
);





-- -- -- -- ============================================================
-- -- -- -- 1. COURSE
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Course (
-- -- --     Course_id INT PRIMARY KEY,
-- -- --     Course_Name VARCHAR(150) NOT NULL,
-- -- --     Description TEXT,
-- -- --     Price DECIMAL(10,2),
-- -- --     No_of_modules INT,
-- -- --     No_of_weeks INT,
-- -- --     Material TEXT,
-- -- --     Category VARCHAR(100) NOT NULL
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 2. TEACHER
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Teacher (
-- -- --     Teacher_id INT PRIMARY KEY,
-- -- --     First_name VARCHAR(100) NOT NULL,
-- -- --     Last_name VARCHAR(100),
-- -- --     DOB DATE,
-- -- --     Age INT,
-- -- --     Sex VARCHAR(20),
-- -- --     Email VARCHAR(255) NOT NULL,
-- -- --     Credential VARCHAR(255) NOT NULL,
-- -- --     Salary DECIMAL(10,2),
-- -- --     Joining_date DATE NOT NULL,
-- -- --     House_no VARCHAR(50),
-- -- --     Street VARCHAR(150),
-- -- --     City VARCHAR(100),
-- -- --     State VARCHAR(100),
-- -- --     Pincode VARCHAR(20),
-- -- --     Aadhar_id VARCHAR(20) UNIQUE,
-- -- --     LastSeen_Global_Notification_id INT,

-- -- --     CONSTRAINT fk_teacher_global_notification
-- -- --         FOREIGN KEY (LastSeen_Global_Notification_id)
-- -- --         REFERENCES GlobalNotification(Notification_id)
-- -- --         ON DELETE SET NULL
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 3. ASSISTANT
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Assistant (
-- -- --     Assistant_id INT PRIMARY KEY,
-- -- --     First_name VARCHAR(100) NOT NULL,
-- -- --     Last_name VARCHAR(100),
-- -- --     Age INT,
-- -- --     Aadhar_id VARCHAR(20) UNIQUE,
-- -- --     DOB DATE,
-- -- --     Email VARCHAR(255) NOT NULL,
-- -- --     Credential VARCHAR(255) NOT NULL,
-- -- --     Sex VARCHAR(20),
-- -- --     Salary DECIMAL(10,2),
-- -- --     House_no VARCHAR(50),
-- -- --     Street VARCHAR(150),
-- -- --     City VARCHAR(100),
-- -- --     State VARCHAR(100),
-- -- --     Pincode VARCHAR(20),
-- -- --     LastSeen_Global_Notification_id INT,

-- -- --     CONSTRAINT fk_assistant_global_notification
-- -- --         FOREIGN KEY (LastSeen_Global_Notification_id)
-- -- --         REFERENCES GlobalNotification(Notification_id)
-- -- --         ON DELETE SET NULL
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 4. ADMIN
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Admin (
-- -- --     Admin_id INT PRIMARY KEY,
-- -- --     First_name VARCHAR(100) NOT NULL,
-- -- --     Last_name VARCHAR(100),
-- -- --     Age INT,
-- -- --     Aadhar_id VARCHAR(20) UNIQUE,
-- -- --     DOB DATE,
-- -- --     Email VARCHAR(255) NOT NULL,
-- -- --     Credential VARCHAR(255) NOT NULL,
-- -- --     Sex VARCHAR(20),
-- -- --     House_no VARCHAR(50),
-- -- --     Street VARCHAR(150),
-- -- --     City VARCHAR(100),
-- -- --     State VARCHAR(100),
-- -- --     Pincode VARCHAR(20)
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 5. GLOBAL NOTIFICATION
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS GlobalNotification (
-- -- --     Notification_id INT PRIMARY KEY,
-- -- --     Assistant_id INT,
-- -- --     Notification_date DATE NOT NULL,
-- -- --     Notification_time TIME NOT NULL,
-- -- --     Notification_title VARCHAR(255) NOT NULL,
-- -- --     Description TEXT NOT NULL,

-- -- --     CONSTRAINT fk_globalnotification_assistant
-- -- --         FOREIGN KEY (Assistant_id)
-- -- --         REFERENCES Assistant(Assistant_id)
-- -- --         ON DELETE SET NULL
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 6. STUDENT
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Student (
-- -- --     Student_id INT PRIMARY KEY,
-- -- --     First_name VARCHAR(100) NOT NULL,
-- -- --     Last_name VARCHAR(100),
-- -- --     Sex VARCHAR(20),
-- -- --     DOB DATE,
-- -- --     Credential VARCHAR(255) NOT NULL,
-- -- --     Age INT,
-- -- --     Email VARCHAR(255) NOT NULL,
-- -- --     House_no VARCHAR(50),
-- -- --     Street VARCHAR(150),
-- -- --     City VARCHAR(100),
-- -- --     State VARCHAR(100),
-- -- --     Pincode VARCHAR(20),
-- -- --     Aadhar_id VARCHAR(20) UNIQUE,
-- -- --     LastSeen_Global_Notification_id INT,

-- -- --     CONSTRAINT fk_student_global_notification
-- -- --         FOREIGN KEY (LastSeen_Global_Notification_id)
-- -- --         REFERENCES GlobalNotification(Notification_id)
-- -- --         ON DELETE SET NULL
-- -- -- );








-- -- -- -- ============================================================
-- -- -- -- 9. STUDENT CONTACTS
-- -- -- -- PK = (Student_id, Phone_no)
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Student_Contacts (
-- -- --     Student_id INT,
-- -- --     Phone_no VARCHAR(20),

-- -- --     PRIMARY KEY (Student_id, Phone_no),

-- -- --     CONSTRAINT fk_student_contacts_student
-- -- --         FOREIGN KEY (Student_id)
-- -- --         REFERENCES Student(Student_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 10. STUDENT COMPLAINTS
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Student_Complaints (
-- -- --     Complaint_id INT,
-- -- --     Student_id INT,
-- -- --     PRIMARY KEY(Complaint_id,Student_id),
-- -- --     Title VARCHAR(255) NOT NULL,
-- -- --     Complaint_date DATE NOT NULL,
-- -- --     Complaint_time TIME NOT NULL,
-- -- --     Complaint_description TEXT ,

-- -- --     CONSTRAINT fk_student_complaints_student
-- -- --         FOREIGN KEY (Student_id)
-- -- --         REFERENCES Student(Student_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 11. BATCH
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Batch (
-- -- --     Batch_id INT PRIMARY KEY,
-- -- --     Teacher_id INT,
-- -- --     Course_id INT,
-- -- --     Start_date DATE,
-- -- --     Start_time TIME,
-- -- --     End_time TIME,
-- -- --     Venue VARCHAR(255),
-- -- --     Modules_Completed INT DEFAULT 0,

-- -- --     CONSTRAINT fk_batch_teacher
-- -- --         FOREIGN KEY (Teacher_id)
-- -- --         REFERENCES Teacher(Teacher_id)
-- -- --         ON DELETE SET NULL,

-- -- --     CONSTRAINT fk_batch_course
-- -- --         FOREIGN KEY (Course_id)
-- -- --         REFERENCES Course(Course_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 12. STUDENT ATTENDANCE
-- -- -- -- PK = (Date, Student_id, Batch_id)
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Student_Attendance (
-- -- --     Date DATE,
-- -- --     Student_id INT,
-- -- --     Batch_id INT,
-- -- --     Status INT CHECK (Status IN (0,1)),

-- -- --     PRIMARY KEY (Date, Student_id, Batch_id),

-- -- --     CONSTRAINT fk_student_attendance_student
-- -- --         FOREIGN KEY (Student_id)
-- -- --         REFERENCES Student(Student_id)
-- -- --         ON DELETE CASCADE,

-- -- --     CONSTRAINT fk_student_attendance_batch
-- -- --         FOREIGN KEY (Batch_id)
-- -- --         REFERENCES Batch(Batch_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 13. ENROLLMENT
-- -- -- -- PK = (Student_id, Batch_id)
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Enrollment (
-- -- --     Student_id INT,
-- -- --     Batch_id INT,
-- -- --     Batch_Notification_Status BOOLEAN ,
-- -- --     Enrollment_date DATE NOT NULL,
-- -- --     Feedback TEXT,
-- -- --     Certificate VARCHAR(255),
-- -- --     Discount DECIMAL(5,2) DEFAULT 0.00,

-- -- --     PRIMARY KEY (Student_id, Batch_id),

-- -- --     CONSTRAINT fk_enrollment_student
-- -- --         FOREIGN KEY (Student_id)
-- -- --         REFERENCES Student(Student_id)
-- -- --         ON DELETE CASCADE,

-- -- --     CONSTRAINT fk_enrollment_batch
-- -- --         FOREIGN KEY (Batch_id)
-- -- --         REFERENCES Batch(Batch_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 14. SCHEDULE
-- -- -- -- PK = (Day, Batch_id)
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Schedule (
-- -- --     Day VARCHAR(20),
-- -- --     Batch_id INT,

-- -- --     PRIMARY KEY (Day, Batch_id),

-- -- --     CONSTRAINT fk_schedule_batch
-- -- --         FOREIGN KEY (Batch_id)
-- -- --         REFERENCES Batch(Batch_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 15. BATCH NOTIFICATION
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Batch_Notification (
-- -- --     Notification_id INT,
-- -- --     Batch_id INT,
-- -- --     PRIMARY KEY(Notification_id,Batch_id)
-- -- --     Description TEXT,
-- -- --     Title VARCHAR(255) NOT NULL,

-- -- --     CONSTRAINT fk_batch_notification_batch
-- -- --         FOREIGN KEY (Batch_id)
-- -- --         REFERENCES Batch(Batch_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 16. TEST
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Test (
-- -- --     Test_id INT,
-- -- --     Batch_id INT,
-- -- --     PRIMARY KEY(Test_id,Batch_id),
-- -- --     Test_title VARCHAR(255) NOT NULL,
-- -- --     Date DATE ,
-- -- --     Question_paper_Link VARCHAR(500),
-- -- --     Answerkey_Link VARCHAR(500),

-- -- --     CONSTRAINT fk_test_batch
-- -- --         FOREIGN KEY (Batch_id)
-- -- --         REFERENCES Batch(Batch_id)
-- -- --         ON DELETE CASCADE
-- -- -- );
-- -- -- -- ADD TRIGGER FOR DELETION IN BACKEND******************

-- -- -- -- ============================================================
-- -- -- -- 17. TEACHER CONTACTS
-- -- -- -- PK = (Teacher_id, Phone_no)
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Teacher_Contacts (
-- -- --     Teacher_id INT,
-- -- --     Phone_no VARCHAR(20),

-- -- --     PRIMARY KEY (Teacher_id, Phone_no),

-- -- --     CONSTRAINT fk_teacher_contacts_teacher
-- -- --         FOREIGN KEY (Teacher_id)
-- -- --         REFERENCES Teacher(Teacher_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 18. TEACHER ATTENDANCE RECORD
-- -- -- -- PK = (Date, Teacher_id)
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Teacher_Attendance_Record (
-- -- --     Date DATE,
-- -- --     Teacher_id INT,
-- -- --     Status DECIMAL(2,1) CHECK (Status IN (0,0.5,1)),

-- -- --     PRIMARY KEY (Date, Teacher_id),

-- -- --     CONSTRAINT fk_teacher_attendance_teacher
-- -- --         FOREIGN KEY (Teacher_id)
-- -- --         REFERENCES Teacher(Teacher_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 19. TEACHER COMPLAINTS
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Teacher_Complaints (
-- -- --     Complaint_id INT,
-- -- --     Teacher_id INT,
-- -- --     PRIMARY KEY(Complaint_id,Teacher_id),
-- -- --     Title VARCHAR(255) NOT NULL,
-- -- --     Complaint_date DATE NOT NULL,
-- -- --     Complaint_time TIME NOT NULL,
-- -- --     Complaint_description TEXT,

-- -- --     CONSTRAINT fk_teacher_complaints_teacher
-- -- --         FOREIGN KEY (Teacher_id)
-- -- --         REFERENCES Teacher(Teacher_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 20. COURSE MODULE
-- -- -- -- PK = (Module_id, Course_id)
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Course_Module (
-- -- --     Module_id INT,
-- -- --     Course_id INT,
-- -- --     Module_title VARCHAR(255) NOT NULL,
-- -- --     Module_description TEXT,

-- -- --     PRIMARY KEY (Module_id, Course_id),

-- -- --     CONSTRAINT fk_course_module_course
-- -- --         FOREIGN KEY (Course_id)
-- -- --         REFERENCES Course(Course_id) 
-- -- --         ON DELETE CASCADE
-- -- -- );



-- -- -- -- ============================================================
-- -- -- -- 21. TEACHER SALARY RECORDS
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Teacher_Salary_Records (
-- -- --     Receipt_id INT PRIMARY KEY,
-- -- --     Teacher_id INT,
-- -- --     Amount DECIMAL(10,2) NOT NULL,
-- -- --     Salary_payment_date DATE NOT NULL,
-- -- --     Month INT NOT NULL,
-- -- --     Year INT NOT NULL,

-- -- --     CONSTRAINT fk_teacher_salary_teacher
-- -- --         FOREIGN KEY (Teacher_id)
-- -- --         REFERENCES Teacher(Teacher_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 22. TEACHER SALARY DETAILS
-- -- -- -- PK = (Receipt_id, Description)
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Teacher_Salary_Details (
-- -- --     Receipt_id INT,
-- -- --     Description TEXT, 

-- -- --     PRIMARY KEY (Receipt_id, Description),

-- -- --     CONSTRAINT fk_teacher_salary_details
-- -- --         FOREIGN KEY (Receipt_id)
-- -- --         REFERENCES Teacher_Salary_Records(Receipt_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 23. ASSISTANT ATTENDANCE RECORD
-- -- -- -- PK = (Date, Assistant_id)
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Assistant_Attendance_Record (
-- -- --     Date DATE,
-- -- --     Assistant_id INT,
-- -- --     Status DECIMAL(2,1) CHECK (STATUS IN (0,0.5,1)),

-- -- --     PRIMARY KEY (Date, Assistant_id),

-- -- --     CONSTRAINT fk_assistant_attendance
-- -- --         FOREIGN KEY (Assistant_id)
-- -- --         REFERENCES Assistant(Assistant_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 24. ASSISTANT CONTACTS
-- -- -- -- PK = (Assistant_id, Phone_no)
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Assistant_Contacts (
-- -- --     Assistant_id INT,
-- -- --     Phone_no VARCHAR(20), 

-- -- --     PRIMARY KEY (Assistant_id, Phone_no),

-- -- --     CONSTRAINT fk_assistant_contacts
-- -- --         FOREIGN KEY (Assistant_id)
-- -- --         REFERENCES Assistant(Assistant_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 25. ASSISTANT COMPLAINTS
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Assistant_Complaints (
-- -- --     Complaint_id INT,
-- -- --     Assistant_id INT,
-- -- --     PRIMARY KEY(Complaint_id,Assistant_id),
-- -- --     Complaint_description TEXT, 
-- -- --     Complaint_Title TEXT NOT NULL,
-- -- --     Complaint_date DATE NOT NULL,    
-- -- --     Complaint_time TIME NOT NULL,    

-- -- --     CONSTRAINT fk_assistant_complaints
-- -- --         FOREIGN KEY (Assistant_id)
-- -- --         REFERENCES Assistant(Assistant_id)
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 26. ADMIN CONTACTS
-- -- -- -- PK = (Admin_id, Phone_no)
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Admin_Contacts (
-- -- --     Admin_id INT,
-- -- --     Phone_no VARCHAR(20),   -- Constraint  not null

-- -- --     PRIMARY KEY (Admin_id, Phone_no),

-- -- --     CONSTRAINT fk_admin_contacts
-- -- --         FOREIGN KEY (Admin_id)
-- -- --         REFERENCES Admin(Admin_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 27. FEE PAYMENT
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Fee_Payment (
-- -- --     Receipt_id INT PRIMARY KEY,
-- -- --     Student_id INT,
-- -- --     Batch_id INT,   
-- -- --     Amount DECIMAL(10,2) NOT NULL, 
-- -- --     Payment_date DATE NOT NULL,      
-- -- --     Payment_time TIME NOT NULL,  
-- -- --     Mode_of_payment VARCHAR(50) NOT NULL, 

-- -- --     CONSTRAINT fk_fee_payment_student
-- -- --         FOREIGN KEY (Student_id)
-- -- --         REFERENCES Student(Student_id)
-- -- --         ON DELETE CASCADE,

-- -- --     CONSTRAINT fk_fee_payment_batch
-- -- --         FOREIGN KEY (Batch_id)
-- -- --         REFERENCES Batch(Batch_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 28. FEE DETAILS
-- -- -- -- PK = (Receipt_id, Description)
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Fee_Details (
-- -- --     Receipt_id INT,
-- -- --     Description TEXT,

-- -- --     PRIMARY KEY (Receipt_id, Description),

-- -- --     CONSTRAINT fk_fee_details
-- -- --         FOREIGN KEY (Receipt_id)
-- -- --         REFERENCES Fee_Payment(Receipt_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 29. ASSISTANT SALARY RECORDS
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Assistant_Salary_Records (
-- -- --     Receipt_id INT PRIMARY KEY,
-- -- --     Assistant_id INT,
-- -- --     Amount DECIMAL(10,2) NOT NULL,   
-- -- --     Salary_payment_date DATE NOT NULL,   
-- -- --     Month INT NOT NULL,  
-- -- --     Year INT NOT NULL,   

-- -- --     CONSTRAINT fk_assistant_salary_assistant    
-- -- --         FOREIGN KEY (Assistant_id)
-- -- --         REFERENCES Assistant(Assistant_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 30. ASSISTANT SALARY DETAILS
-- -- -- -- PK = (Receipt_id, Description)
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Assistant_Salary_Details (
-- -- --     Receipt_id INT,
-- -- --     Description TEXT, 

-- -- --     PRIMARY KEY (Receipt_id, Description),

-- -- --     CONSTRAINT fk_assistant_salary_details
-- -- --         FOREIGN KEY (Receipt_id)
-- -- --         REFERENCES Assistant_Salary_Records(Receipt_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 31. TAKES
-- -- -- -- PK = (Student_id, Batch_id, Test_id)
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Takes (
-- -- --     Student_id INT,
-- -- --     Batch_id INT,
-- -- --     Test_id INT,
-- -- --     Score DECIMAL(5,2),         

-- -- --     PRIMARY KEY (Student_id, Batch_id, Test_id),

-- -- --     CONSTRAINT fk_takes_student
-- -- --         FOREIGN KEY (Student_id)
-- -- --         REFERENCES Student(Student_id)
-- -- --         ON DELETE CASCADE,

-- -- --     CONSTRAINT fk_takes_batch
-- -- --         FOREIGN KEY (Batch_id)
-- -- --         REFERENCES Batch(Batch_id)
-- -- --         ON DELETE CASCADE,

-- -- --     CONSTRAINT fk_takes_test
-- -- --         FOREIGN KEY (Test_id)
-- -- --         REFERENCES Test(Test_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- Add not NULL to middle name (in each of the following tables), defautl value = empty string


-- -- -- -- ============================================================
-- -- -- -- 32. STUDENT MIDDLE NAME
-- -- -- -- PK = (Sequence_No, Student_id)
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Student_Middle_Name (
-- -- --     Sequence_No INT,
-- -- --     Student_id INT,
-- -- --     Middle_Name VARCHAR(100) NOT NULL,

-- -- --     PRIMARY KEY (Sequence_No, Student_id),

-- -- --     CONSTRAINT fk_student_middle_name_student
-- -- --         FOREIGN KEY (Student_id)
-- -- --         REFERENCES Student(Student_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 33. TEACHER MIDDLE NAME
-- -- -- -- PK = (Sequence_No, Teacher_id)
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Teacher_Middle_Name (
-- -- --     Sequence_No INT,
-- -- --     Teacher_id INT,
-- -- --     Middle_Name VARCHAR(100) NOT NULL,

-- -- --     PRIMARY KEY (Sequence_No, Teacher_id),

-- -- --     CONSTRAINT fk_teacher_middle_name_teacher
-- -- --         FOREIGN KEY (Teacher_id)
-- -- --         REFERENCES Teacher(Teacher_id)
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 34. ASSISTANT MIDDLE NAME
-- -- -- -- PK = (Sequence_No, Assistant_id)
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Assistant_Middle_Name (
-- -- --     Sequence_No INT,
-- -- --     Assistant_id INT,
-- -- --     Middle_Name VARCHAR(100) NOT NULL,

-- -- --     PRIMARY KEY (Sequence_No, Assistant_id),

-- -- --     CONSTRAINT fk_assistant_middle_name
-- -- --         FOREIGN KEY (Assistant_id)
-- -- --         REFERENCES Assistant(Assistant_id)
-- -- --         ON DELETE CASCADE
-- -- -- );


-- -- -- -- ============================================================
-- -- -- -- 35. ADMIN MIDDLE NAME
-- -- -- -- PK = (Sequence_No, Admin_id)
-- -- -- -- ============================================================

-- -- -- CREATE TABLE IF NOT EXISTS Admin_Middle_Name (
-- -- --     Sequence_No INT,
-- -- --     Admin_id INT ,
-- -- --     Middle_Name VARCHAR(100) NOT NULL,

-- -- --     PRIMARY KEY (Sequence_No, Admin_id),

-- -- --     CONSTRAINT fk_admin_middle_name
-- -- --         FOREIGN KEY (Admin_id)
-- -- --         REFERENCES Admin(Admin_id)
-- -- --         ON DELETE CASCADE
-- -- -- );






























-- -- -- ============================================================
-- -- -- 1. COURSE
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Course (
-- --     Course_id INT PRIMARY KEY,
-- --     Course_Name VARCHAR(150) NOT NULL,
-- --     Description TEXT,
-- --     Price DECIMAL(10,2),
-- --     No_of_modules INT,
-- --     No_of_weeks INT,
-- --     Material TEXT,
-- --     Category VARCHAR(100) NOT NULL
-- -- );


-- -- -- ============================================================
-- -- -- 3. ASSISTANT
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Assistant (
-- --     Assistant_id INT PRIMARY KEY,
-- --     First_name VARCHAR(100) NOT NULL,
-- --     Last_name VARCHAR(100),
-- --     Age INT,
-- --     Aadhar_id VARCHAR(20) UNIQUE,
-- --     DOB DATE,
-- --     Email VARCHAR(255) NOT NULL,
-- --     Credential VARCHAR(255) NOT NULL,
-- --     Sex VARCHAR(20),
-- --     Salary DECIMAL(10,2),
-- --     House_no VARCHAR(50),
-- --     Street VARCHAR(150),
-- --     City VARCHAR(100),
-- --     State VARCHAR(100),
-- --     Pincode VARCHAR(20),
-- --     LastSeen_Global_Notification_id INT,

-- --     CONSTRAINT fk_assistant_global_notification
-- --         FOREIGN KEY (LastSeen_Global_Notification_id)
-- --         REFERENCES GlobalNotification(Notification_id)
-- --         ON DELETE SET NULL
-- -- );


-- -- -- ============================================================
-- -- -- 4. ADMIN
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Admin (
-- --     Admin_id INT PRIMARY KEY,
-- --     First_name VARCHAR(100) NOT NULL,
-- --     Last_name VARCHAR(100),
-- --     Age INT,
-- --     Aadhar_id VARCHAR(20) UNIQUE,
-- --     DOB DATE,
-- --     Email VARCHAR(255) NOT NULL,
-- --     Credential VARCHAR(255) NOT NULL,
-- --     Sex VARCHAR(20),
-- --     House_no VARCHAR(50),
-- --     Street VARCHAR(150),
-- --     City VARCHAR(100),
-- --     State VARCHAR(100),
-- --     Pincode VARCHAR(20)
-- -- );


-- -- -- ============================================================
-- -- -- 5. GLOBAL NOTIFICATION
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS GlobalNotification (
-- --     Notification_id INT PRIMARY KEY,
-- --     Assistant_id INT,
-- --     Notification_date DATE NOT NULL,
-- --     Notification_time TIME NOT NULL,
-- --     Notification_title VARCHAR(255) NOT NULL,
-- --     Description TEXT NOT NULL,

-- --     CONSTRAINT fk_globalnotification_assistant
-- --         FOREIGN KEY (Assistant_id)
-- --         REFERENCES Assistant(Assistant_id)
-- --         ON DELETE SET NULL
-- -- );


-- -- -- ============================================================
-- -- -- 2. TEACHER
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Teacher (
-- --     Teacher_id INT PRIMARY KEY,
-- --     First_name VARCHAR(100) NOT NULL,
-- --     Last_name VARCHAR(100),
-- --     DOB DATE,
-- --     Age INT,
-- --     Sex VARCHAR(20),
-- --     Email VARCHAR(255) NOT NULL,
-- --     Credential VARCHAR(255) NOT NULL,
-- --     Salary DECIMAL(10,2),
-- --     Joining_date DATE NOT NULL,
-- --     House_no VARCHAR(50),
-- --     Street VARCHAR(150),
-- --     City VARCHAR(100),
-- --     State VARCHAR(100),
-- --     Pincode VARCHAR(20),
-- --     Aadhar_id VARCHAR(20) UNIQUE,
-- --     LastSeen_Global_Notification_id INT,

-- --     CONSTRAINT fk_teacher_global_notification
-- --         FOREIGN KEY (LastSeen_Global_Notification_id)
-- --         REFERENCES GlobalNotification(Notification_id)
-- --         ON DELETE SET NULL
-- -- );


-- -- -- ============================================================
-- -- -- 6. STUDENT
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Student (
-- --     Student_id INT PRIMARY KEY,
-- --     First_name VARCHAR(100) NOT NULL,
-- --     Last_name VARCHAR(100),
-- --     Sex VARCHAR(20),
-- --     DOB DATE,
-- --     Credential VARCHAR(255) NOT NULL,
-- --     Age INT,
-- --     Email VARCHAR(255) NOT NULL,
-- --     House_no VARCHAR(50),
-- --     Street VARCHAR(150),
-- --     City VARCHAR(100),
-- --     State VARCHAR(100),
-- --     Pincode VARCHAR(20),
-- --     Aadhar_id VARCHAR(20) UNIQUE,
-- --     LastSeen_Global_Notification_id INT,

-- --     CONSTRAINT fk_student_global_notification
-- --         FOREIGN KEY (LastSeen_Global_Notification_id)
-- --         REFERENCES GlobalNotification(Notification_id)
-- --         ON DELETE SET NULL
-- -- );








-- -- -- ============================================================
-- -- -- 9. STUDENT CONTACTS
-- -- -- PK = (Student_id, Phone_no)
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Student_Contacts (
-- --     Student_id INT,
-- --     Phone_no VARCHAR(20),

-- --     PRIMARY KEY (Student_id, Phone_no),

-- --     CONSTRAINT fk_student_contacts_student
-- --         FOREIGN KEY (Student_id)
-- --         REFERENCES Student(Student_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 10. STUDENT COMPLAINTS
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Student_Complaints (
-- --     Complaint_id INT,
-- --     Student_id INT,
-- --     PRIMARY KEY(Complaint_id,Student_id),
-- --     Title VARCHAR(255) NOT NULL,
-- --     Complaint_date DATE NOT NULL,
-- --     Complaint_time TIME NOT NULL,
-- --     Complaint_description TEXT ,

-- --     CONSTRAINT fk_student_complaints_student
-- --         FOREIGN KEY (Student_id)
-- --         REFERENCES Student(Student_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 11. BATCH
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Batch (
-- --     Batch_id INT PRIMARY KEY,
-- --     Teacher_id INT,
-- --     Course_id INT,
-- --     Start_date DATE,
-- --     Start_time TIME,
-- --     End_time TIME,
-- --     Venue VARCHAR(255),
-- --     Modules_Completed INT DEFAULT 0,

-- --     CONSTRAINT fk_batch_teacher
-- --         FOREIGN KEY (Teacher_id)
-- --         REFERENCES Teacher(Teacher_id)
-- --         ON DELETE SET NULL,

-- --     CONSTRAINT fk_batch_course
-- --         FOREIGN KEY (Course_id)
-- --         REFERENCES Course(Course_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 12. STUDENT ATTENDANCE
-- -- -- PK = (Date, Student_id, Batch_id)
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Student_Attendance (
-- --     Date DATE,
-- --     Student_id INT,
-- --     Batch_id INT,
-- --     Status INT CHECK (Status IN (0,1)),

-- --     PRIMARY KEY (Date, Student_id, Batch_id),

-- --     CONSTRAINT fk_student_attendance_student
-- --         FOREIGN KEY (Student_id)
-- --         REFERENCES Student(Student_id)
-- --         ON DELETE CASCADE,

-- --     CONSTRAINT fk_student_attendance_batch
-- --         FOREIGN KEY (Batch_id)
-- --         REFERENCES Batch(Batch_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 13. ENROLLMENT
-- -- -- PK = (Student_id, Batch_id)
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Enrollment (
-- --     Student_id INT,
-- --     Batch_id INT,
-- --     Batch_Notification_Status BOOLEAN ,
-- --     Enrollment_date DATE NOT NULL,
-- --     Feedback TEXT,
-- --     Certificate VARCHAR(255),
-- --     Discount DECIMAL(5,2) DEFAULT 0.00,

-- --     PRIMARY KEY (Student_id, Batch_id),

-- --     CONSTRAINT fk_enrollment_student
-- --         FOREIGN KEY (Student_id)
-- --         REFERENCES Student(Student_id)
-- --         ON DELETE CASCADE,

-- --     CONSTRAINT fk_enrollment_batch
-- --         FOREIGN KEY (Batch_id)
-- --         REFERENCES Batch(Batch_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 14. SCHEDULE
-- -- -- PK = (Day, Batch_id)
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Schedule (
-- --     Day VARCHAR(20),
-- --     Batch_id INT,

-- --     PRIMARY KEY (Day, Batch_id),

-- --     CONSTRAINT fk_schedule_batch
-- --         FOREIGN KEY (Batch_id)
-- --         REFERENCES Batch(Batch_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 15. BATCH NOTIFICATION
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Batch_Notification (
-- --     Notification_id INT,
-- --     Batch_id INT,
-- --     PRIMARY KEY(Notification_id,Batch_id)
-- --     Description TEXT,
-- --     Title VARCHAR(255) NOT NULL,

-- --     CONSTRAINT fk_batch_notification_batch
-- --         FOREIGN KEY (Batch_id)
-- --         REFERENCES Batch(Batch_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 16. TEST
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Test (
-- --     Test_id INT,
-- --     Batch_id INT,
-- --     PRIMARY KEY(Test_id,Batch_id),
-- --     Test_title VARCHAR(255) NOT NULL,
-- --     Date DATE ,
-- --     Question_paper_Link VARCHAR(500),
-- --     Answerkey_Link VARCHAR(500),

-- --     CONSTRAINT fk_test_batch
-- --         FOREIGN KEY (Batch_id)
-- --         REFERENCES Batch(Batch_id)
-- --         ON DELETE CASCADE
-- -- );
-- -- -- ADD TRIGGER FOR DELETION IN BACKEND******************

-- -- -- ============================================================
-- -- -- 17. TEACHER CONTACTS
-- -- -- PK = (Teacher_id, Phone_no)
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Teacher_Contacts (
-- --     Teacher_id INT,
-- --     Phone_no VARCHAR(20),

-- --     PRIMARY KEY (Teacher_id, Phone_no),

-- --     CONSTRAINT fk_teacher_contacts_teacher
-- --         FOREIGN KEY (Teacher_id)
-- --         REFERENCES Teacher(Teacher_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 18. TEACHER ATTENDANCE RECORD
-- -- -- PK = (Date, Teacher_id)
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Teacher_Attendance_Record (
-- --     Date DATE,
-- --     Teacher_id INT,
-- --     Status DECIMAL(2,1) CHECK (Status IN (0,0.5,1)),

-- --     PRIMARY KEY (Date, Teacher_id),

-- --     CONSTRAINT fk_teacher_attendance_teacher
-- --         FOREIGN KEY (Teacher_id)
-- --         REFERENCES Teacher(Teacher_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 19. TEACHER COMPLAINTS
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Teacher_Complaints (
-- --     Complaint_id INT,
-- --     Teacher_id INT,
-- --     PRIMARY KEY(Complaint_id,Teacher_id),
-- --     Title VARCHAR(255) NOT NULL,
-- --     Complaint_date DATE NOT NULL,
-- --     Complaint_time TIME NOT NULL,
-- --     Complaint_description TEXT,

-- --     CONSTRAINT fk_teacher_complaints_teacher
-- --         FOREIGN KEY (Teacher_id)
-- --         REFERENCES Teacher(Teacher_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 20. COURSE MODULE
-- -- -- PK = (Module_id, Course_id)
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Course_Module (
-- --     Module_id INT,
-- --     Course_id INT,
-- --     Module_title VARCHAR(255) NOT NULL,
-- --     Module_description TEXT,

-- --     PRIMARY KEY (Module_id, Course_id),

-- --     CONSTRAINT fk_course_module_course
-- --         FOREIGN KEY (Course_id)
-- --         REFERENCES Course(Course_id) 
-- --         ON DELETE CASCADE
-- -- );



-- -- -- ============================================================
-- -- -- 21. TEACHER SALARY RECORDS
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Teacher_Salary_Records (
-- --     Receipt_id INT PRIMARY KEY,
-- --     Teacher_id INT,
-- --     Amount DECIMAL(10,2) NOT NULL,
-- --     Salary_payment_date DATE NOT NULL,
-- --     Month INT NOT NULL,
-- --     Year INT NOT NULL,

-- --     CONSTRAINT fk_teacher_salary_teacher
-- --         FOREIGN KEY (Teacher_id)
-- --         REFERENCES Teacher(Teacher_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 22. TEACHER SALARY DETAILS
-- -- -- PK = (Receipt_id, Description)
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Teacher_Salary_Details (
-- --     Receipt_id INT,
-- --     Description TEXT, 

-- --     PRIMARY KEY (Receipt_id, Description),

-- --     CONSTRAINT fk_teacher_salary_details
-- --         FOREIGN KEY (Receipt_id)
-- --         REFERENCES Teacher_Salary_Records(Receipt_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 23. ASSISTANT ATTENDANCE RECORD
-- -- -- PK = (Date, Assistant_id)
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Assistant_Attendance_Record (
-- --     Date DATE,
-- --     Assistant_id INT,
-- --     Status DECIMAL(2,1) CHECK (STATUS IN (0,0.5,1)),

-- --     PRIMARY KEY (Date, Assistant_id),

-- --     CONSTRAINT fk_assistant_attendance
-- --         FOREIGN KEY (Assistant_id)
-- --         REFERENCES Assistant(Assistant_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 24. ASSISTANT CONTACTS
-- -- -- PK = (Assistant_id, Phone_no)
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Assistant_Contacts (
-- --     Assistant_id INT,
-- --     Phone_no VARCHAR(20), 

-- --     PRIMARY KEY (Assistant_id, Phone_no),

-- --     CONSTRAINT fk_assistant_contacts
-- --         FOREIGN KEY (Assistant_id)
-- --         REFERENCES Assistant(Assistant_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 25. ASSISTANT COMPLAINTS
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Assistant_Complaints (
-- --     Complaint_id INT,
-- --     Assistant_id INT,
-- --     PRIMARY KEY(Complaint_id,Assistant_id),
-- --     Complaint_description TEXT, 
-- --     Complaint_Title TEXT NOT NULL,
-- --     Complaint_date DATE NOT NULL,    
-- --     Complaint_time TIME NOT NULL,    

-- --     CONSTRAINT fk_assistant_complaints
-- --         FOREIGN KEY (Assistant_id)
-- --         REFERENCES Assistant(Assistant_id)
-- -- );


-- -- -- ============================================================
-- -- -- 26. ADMIN CONTACTS
-- -- -- PK = (Admin_id, Phone_no)
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Admin_Contacts (
-- --     Admin_id INT,
-- --     Phone_no VARCHAR(20),   -- Constraint  not null

-- --     PRIMARY KEY (Admin_id, Phone_no),

-- --     CONSTRAINT fk_admin_contacts
-- --         FOREIGN KEY (Admin_id)
-- --         REFERENCES Admin(Admin_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 27. FEE PAYMENT
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Fee_Payment (
-- --     Receipt_id INT PRIMARY KEY,
-- --     Student_id INT,
-- --     Batch_id INT,   
-- --     Amount DECIMAL(10,2) NOT NULL, 
-- --     Payment_date DATE NOT NULL,      
-- --     Payment_time TIME NOT NULL,  
-- --     Mode_of_payment VARCHAR(50) NOT NULL, 

-- --     CONSTRAINT fk_fee_payment_student
-- --         FOREIGN KEY (Student_id)
-- --         REFERENCES Student(Student_id)
-- --         ON DELETE CASCADE,

-- --     CONSTRAINT fk_fee_payment_batch
-- --         FOREIGN KEY (Batch_id)
-- --         REFERENCES Batch(Batch_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 28. FEE DETAILS
-- -- -- PK = (Receipt_id, Description)
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Fee_Details (
-- --     Receipt_id INT,
-- --     Description TEXT,

-- --     PRIMARY KEY (Receipt_id, Description),

-- --     CONSTRAINT fk_fee_details
-- --         FOREIGN KEY (Receipt_id)
-- --         REFERENCES Fee_Payment(Receipt_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 29. ASSISTANT SALARY RECORDS
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Assistant_Salary_Records (
-- --     Receipt_id INT PRIMARY KEY,
-- --     Assistant_id INT,
-- --     Amount DECIMAL(10,2) NOT NULL,   
-- --     Salary_payment_date DATE NOT NULL,   
-- --     Month INT NOT NULL,  
-- --     Year INT NOT NULL,   

-- --     CONSTRAINT fk_assistant_salary_assistant    
-- --         FOREIGN KEY (Assistant_id)
-- --         REFERENCES Assistant(Assistant_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 30. ASSISTANT SALARY DETAILS
-- -- -- PK = (Receipt_id, Description)
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Assistant_Salary_Details (
-- --     Receipt_id INT,
-- --     Description TEXT, 

-- --     PRIMARY KEY (Receipt_id, Description),

-- --     CONSTRAINT fk_assistant_salary_details
-- --         FOREIGN KEY (Receipt_id)
-- --         REFERENCES Assistant_Salary_Records(Receipt_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 31. TAKES
-- -- -- PK = (Student_id, Batch_id, Test_id)
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Takes (
-- --     Student_id INT,
-- --     Batch_id INT,
-- --     Test_id INT,
-- --     Score DECIMAL(5,2),         

-- --     PRIMARY KEY (Student_id, Batch_id, Test_id),

-- --     CONSTRAINT fk_takes_student
-- --         FOREIGN KEY (Student_id)
-- --         REFERENCES Student(Student_id)
-- --         ON DELETE CASCADE,

-- --     CONSTRAINT fk_takes_batch
-- --         FOREIGN KEY (Batch_id)
-- --         REFERENCES Batch(Batch_id)
-- --         ON DELETE CASCADE,

-- --     CONSTRAINT fk_takes_test
-- --         FOREIGN KEY (Test_id)
-- --         REFERENCES Test(Test_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- Add not NULL to middle name (in each of the following tables), defautl value = empty string


-- -- -- ============================================================
-- -- -- 32. STUDENT MIDDLE NAME
-- -- -- PK = (Sequence_No, Student_id)
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Student_Middle_Name (
-- --     Sequence_No INT,
-- --     Student_id INT,
-- --     Middle_Name VARCHAR(100) NOT NULL,

-- --     PRIMARY KEY (Sequence_No, Student_id),

-- --     CONSTRAINT fk_student_middle_name_student
-- --         FOREIGN KEY (Student_id)
-- --         REFERENCES Student(Student_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 33. TEACHER MIDDLE NAME
-- -- -- PK = (Sequence_No, Teacher_id)
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Teacher_Middle_Name (
-- --     Sequence_No INT,
-- --     Teacher_id INT,
-- --     Middle_Name VARCHAR(100) NOT NULL,

-- --     PRIMARY KEY (Sequence_No, Teacher_id),

-- --     CONSTRAINT fk_teacher_middle_name_teacher
-- --         FOREIGN KEY (Teacher_id)
-- --         REFERENCES Teacher(Teacher_id)
-- -- );


-- -- -- ============================================================
-- -- -- 34. ASSISTANT MIDDLE NAME
-- -- -- PK = (Sequence_No, Assistant_id)
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Assistant_Middle_Name (
-- --     Sequence_No INT,
-- --     Assistant_id INT,
-- --     Middle_Name VARCHAR(100) NOT NULL,

-- --     PRIMARY KEY (Sequence_No, Assistant_id),

-- --     CONSTRAINT fk_assistant_middle_name
-- --         FOREIGN KEY (Assistant_id)
-- --         REFERENCES Assistant(Assistant_id)
-- --         ON DELETE CASCADE
-- -- );


-- -- -- ============================================================
-- -- -- 35. ADMIN MIDDLE NAME
-- -- -- PK = (Sequence_No, Admin_id)
-- -- -- ============================================================

-- -- CREATE TABLE IF NOT EXISTS Admin_Middle_Name (
-- --     Sequence_No INT,
-- --     Admin_id INT ,
-- --     Middle_Name VARCHAR(100) NOT NULL,

-- --     PRIMARY KEY (Sequence_No, Admin_id),

-- --     CONSTRAINT fk_admin_middle_name
-- --         FOREIGN KEY (Admin_id)
-- --         REFERENCES Admin(Admin_id)
-- --         ON DELETE CASCADE
-- -- );




-- -- ============================================================
-- -- 1. COURSE
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Course (
--     Course_id INT PRIMARY KEY,
--     Course_Name VARCHAR(150) NOT NULL,
--     Description TEXT,
--     Price DECIMAL(10,2),
--     No_of_modules INT,
--     No_of_weeks INT,
--     Material TEXT,
--     Category VARCHAR(100) NOT NULL
-- );


-- -- ============================================================
-- -- 2. ASSISTANT
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Assistant (
--     Assistant_id INT PRIMARY KEY,
--     First_name VARCHAR(100) NOT NULL,
--     Last_name VARCHAR(100),
--     Age INT,
--     Aadhar_id VARCHAR(20) UNIQUE,
--     DOB DATE,
--     Email VARCHAR(255) NOT NULL,
--     Credential VARCHAR(255) NOT NULL,
--     Sex VARCHAR(20),
--     Salary DECIMAL(10,2),
--     House_no VARCHAR(50),
--     Street VARCHAR(150),
--     City VARCHAR(100),
--     State VARCHAR(100),
--     Pincode VARCHAR(20)
-- );


-- -- ============================================================
-- -- 3. ADMIN
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Admin (
--     Admin_id INT PRIMARY KEY,
--     First_name VARCHAR(100) NOT NULL,
--     Last_name VARCHAR(100),
--     Age INT,
--     Aadhar_id VARCHAR(20) UNIQUE,
--     DOB DATE,
--     Email VARCHAR(255) NOT NULL,
--     Credential VARCHAR(255) NOT NULL,
--     Sex VARCHAR(20),
--     House_no VARCHAR(50),
--     Street VARCHAR(150),
--     City VARCHAR(100),
--     State VARCHAR(100),
--     Pincode VARCHAR(20)
-- );


-- -- ============================================================
-- -- 4. GLOBAL NOTIFICATION
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS GlobalNotification (
--     Notification_id INT PRIMARY KEY,
--     Assistant_id INT,
--     Notification_date DATE NOT NULL,
--     Notification_time TIME NOT NULL,
--     Notification_title VARCHAR(255) NOT NULL,
--     Description TEXT NOT NULL,

--     CONSTRAINT fk_globalnotification_assistant
--         FOREIGN KEY (Assistant_id)
--         REFERENCES Assistant(Assistant_id)
--         ON DELETE SET NULL
-- );


-- -- ============================================================
-- -- 5. ASSISTANT LAST SEEN NOTIFICATION (Cycle Breaker)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Assistant_LastSeen_Notification (
--     Assistant_id INT PRIMARY KEY,
--     LastSeen_Global_Notification_id INT,

--     CONSTRAINT fk_aln_assistant
--         FOREIGN KEY (Assistant_id)
--         REFERENCES Assistant(Assistant_id)
--         ON DELETE CASCADE,

--     CONSTRAINT fk_aln_global_notification
--         FOREIGN KEY (LastSeen_Global_Notification_id)
--         REFERENCES GlobalNotification(Notification_id)
--         ON DELETE SET NULL
-- );


-- -- ============================================================
-- -- 6. TEACHER
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Teacher (
--     Teacher_id INT PRIMARY KEY,
--     First_name VARCHAR(100) NOT NULL,
--     Last_name VARCHAR(100),
--     DOB DATE,
--     Age INT,
--     Sex VARCHAR(20),
--     Email VARCHAR(255) NOT NULL,
--     Credential VARCHAR(255) NOT NULL,
--     Salary DECIMAL(10,2),
--     Joining_date DATE NOT NULL,
--     House_no VARCHAR(50),
--     Street VARCHAR(150),
--     City VARCHAR(100),
--     State VARCHAR(100),
--     Pincode VARCHAR(20),
--     Aadhar_id VARCHAR(20) UNIQUE,
--     LastSeen_Global_Notification_id INT,

--     CONSTRAINT fk_teacher_global_notification
--         FOREIGN KEY (LastSeen_Global_Notification_id)
--         REFERENCES GlobalNotification(Notification_id)
--         ON DELETE SET NULL
-- );


-- -- ============================================================
-- -- 7. STUDENT
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Student (
--     Student_id INT PRIMARY KEY,
--     First_name VARCHAR(100) NOT NULL,
--     Last_name VARCHAR(100),
--     Sex VARCHAR(20),
--     DOB DATE,
--     Credential VARCHAR(255) NOT NULL,
--     Age INT,
--     Email VARCHAR(255) NOT NULL,
--     House_no VARCHAR(50),
--     Street VARCHAR(150),
--     City VARCHAR(100),
--     State VARCHAR(100),
--     Pincode VARCHAR(20),
--     Aadhar_id VARCHAR(20) UNIQUE,
--     LastSeen_Global_Notification_id INT,

--     CONSTRAINT fk_student_global_notification
--         FOREIGN KEY (LastSeen_Global_Notification_id)
--         REFERENCES GlobalNotification(Notification_id)
--         ON DELETE SET NULL
-- );


-- -- ============================================================
-- -- 8. STUDENT CONTACTS
-- -- PK = (Student_id, Phone_no)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Student_Contacts (
--     Student_id INT,
--     Phone_no VARCHAR(20),

--     PRIMARY KEY (Student_id, Phone_no),

--     CONSTRAINT fk_student_contacts_student
--         FOREIGN KEY (Student_id)
--         REFERENCES Student(Student_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 9. STUDENT COMPLAINTS
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Student_Complaints (
--     Complaint_id INT,
--     Student_id INT,
--     PRIMARY KEY(Complaint_id,Student_id),
--     Title VARCHAR(255) NOT NULL,
--     Complaint_date DATE NOT NULL,
--     Complaint_time TIME NOT NULL,
--     Complaint_description TEXT ,

--     CONSTRAINT fk_student_complaints_student
--         FOREIGN KEY (Student_id)
--         REFERENCES Student(Student_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 10. BATCH
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Batch (
--     Batch_id INT PRIMARY KEY,
--     Teacher_id INT,
--     Course_id INT,
--     Start_date DATE,
--     Start_time TIME,
--     End_time TIME,
--     Venue VARCHAR(255),
--     Modules_Completed INT DEFAULT 0,

--     CONSTRAINT fk_batch_teacher
--         FOREIGN KEY (Teacher_id)
--         REFERENCES Teacher(Teacher_id)
--         ON DELETE SET NULL,

--     CONSTRAINT fk_batch_course
--         FOREIGN KEY (Course_id)
--         REFERENCES Course(Course_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 11. STUDENT ATTENDANCE
-- -- PK = (Date, Student_id, Batch_id)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Student_Attendance (
--     Date DATE,
--     Student_id INT,
--     Batch_id INT,
--     Status INT CHECK (Status IN (0,1)),

--     PRIMARY KEY (Date, Student_id, Batch_id),

--     CONSTRAINT fk_student_attendance_student
--         FOREIGN KEY (Student_id)
--         REFERENCES Student(Student_id)
--         ON DELETE CASCADE,

--     CONSTRAINT fk_student_attendance_batch
--         FOREIGN KEY (Batch_id)
--         REFERENCES Batch(Batch_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 12. ENROLLMENT
-- -- PK = (Student_id, Batch_id)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Enrollment (
--     Student_id INT,
--     Batch_id INT,
--     Batch_Notification_Status BOOLEAN,
--     Enrollment_date DATE NOT NULL,
--     Feedback TEXT,
--     Certificate VARCHAR(255),
--     Discount DECIMAL(5,2) DEFAULT 0.00,

--     PRIMARY KEY (Student_id, Batch_id),

--     CONSTRAINT fk_enrollment_student
--         FOREIGN KEY (Student_id)
--         REFERENCES Student(Student_id)
--         ON DELETE CASCADE,

--     CONSTRAINT fk_enrollment_batch
--         FOREIGN KEY (Batch_id)
--         REFERENCES Batch(Batch_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 13. SCHEDULE
-- -- PK = (Day, Batch_id)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Schedule (
--     Day VARCHAR(20),
--     Batch_id INT,

--     PRIMARY KEY (Day, Batch_id),

--     CONSTRAINT fk_schedule_batch
--         FOREIGN KEY (Batch_id)
--         REFERENCES Batch(Batch_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 14. BATCH NOTIFICATION
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Batch_Notification (
--     Notification_id INT,
--     Batch_id INT,
--     PRIMARY KEY(Notification_id,Batch_id),
--     Description TEXT,
--     Title VARCHAR(255) NOT NULL,

--     CONSTRAINT fk_batch_notification_batch
--         FOREIGN KEY (Batch_id)
--         REFERENCES Batch(Batch_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 15. TEST
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Test (
--     Test_id INT,
--     Batch_id INT,
--     PRIMARY KEY(Test_id,Batch_id),
--     Test_title VARCHAR(255) NOT NULL,
--     Date DATE,
--     Question_paper_Link VARCHAR(500),
--     Answerkey_Link VARCHAR(500),

--     CONSTRAINT fk_test_batch
--         FOREIGN KEY (Batch_id)
--         REFERENCES Batch(Batch_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 16. TEACHER CONTACTS
-- -- PK = (Teacher_id, Phone_no)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Teacher_Contacts (
--     Teacher_id INT,
--     Phone_no VARCHAR(20),

--     PRIMARY KEY (Teacher_id, Phone_no),

--     CONSTRAINT fk_teacher_contacts_teacher
--         FOREIGN KEY (Teacher_id)
--         REFERENCES Teacher(Teacher_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 17. TEACHER ATTENDANCE RECORD
-- -- PK = (Date, Teacher_id)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Teacher_Attendance_Record (
--     Date DATE,
--     Teacher_id INT,
--     Status DECIMAL(2,1) CHECK (Status IN (0,0.5,1)),

--     PRIMARY KEY (Date, Teacher_id),

--     CONSTRAINT fk_teacher_attendance_teacher
--         FOREIGN KEY (Teacher_id)
--         REFERENCES Teacher(Teacher_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 18. TEACHER COMPLAINTS
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Teacher_Complaints (
--     Complaint_id INT,
--     Teacher_id INT,
--     PRIMARY KEY(Complaint_id,Teacher_id),
--     Title VARCHAR(255) NOT NULL,
--     Complaint_date DATE NOT NULL,
--     Complaint_time TIME NOT NULL,
--     Complaint_description TEXT,

--     CONSTRAINT fk_teacher_complaints_teacher
--         FOREIGN KEY (Teacher_id)
--         REFERENCES Teacher(Teacher_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 19. COURSE MODULE
-- -- PK = (Module_id, Course_id)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Course_Module (
--     Module_id INT,
--     Course_id INT,
--     Module_title VARCHAR(255) NOT NULL,
--     Module_description TEXT,

--     PRIMARY KEY (Module_id, Course_id),

--     CONSTRAINT fk_course_module_course
--         FOREIGN KEY (Course_id)
--         REFERENCES Course(Course_id) 
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 20. TEACHER SALARY RECORDS
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Teacher_Salary_Records (
--     Receipt_id INT PRIMARY KEY,
--     Teacher_id INT,
--     Amount DECIMAL(10,2) NOT NULL,
--     Salary_payment_date DATE NOT NULL,
--     Month INT NOT NULL,
--     Year INT NOT NULL,

--     CONSTRAINT fk_teacher_salary_teacher
--         FOREIGN KEY (Teacher_id)
--         REFERENCES Teacher(Teacher_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 21. TEACHER SALARY DETAILS
-- -- PK = (Receipt_id, Description)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Teacher_Salary_Details (
--     Receipt_id INT,
--     Description VARCHAR(255), -- Changed from TEXT to VARCHAR(255)

--     PRIMARY KEY (Receipt_id, Description),

--     CONSTRAINT fk_teacher_salary_details
--         FOREIGN KEY (Receipt_id)
--         REFERENCES Teacher_Salary_Records(Receipt_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 22. ASSISTANT ATTENDANCE RECORD
-- -- PK = (Date, Assistant_id)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Assistant_Attendance_Record (
--     Date DATE,
--     Assistant_id INT,
--     Status DECIMAL(2,1) CHECK (STATUS IN (0,0.5,1)),

--     PRIMARY KEY (Date, Assistant_id),

--     CONSTRAINT fk_assistant_attendance
--         FOREIGN KEY (Assistant_id)
--         REFERENCES Assistant(Assistant_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 23. ASSISTANT CONTACTS
-- -- PK = (Assistant_id, Phone_no)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Assistant_Contacts (
--     Assistant_id INT,
--     Phone_no VARCHAR(20), 

--     PRIMARY KEY (Assistant_id, Phone_no),

--     CONSTRAINT fk_assistant_contacts
--         FOREIGN KEY (Assistant_id)
--         REFERENCES Assistant(Assistant_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 24. ASSISTANT COMPLAINTS
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Assistant_Complaints (
--     Complaint_id INT,
--     Assistant_id INT,
--     PRIMARY KEY(Complaint_id,Assistant_id),
--     Complaint_description TEXT, 
--     Complaint_Title TEXT NOT NULL,
--     Complaint_date DATE NOT NULL,    
--     Complaint_time TIME NOT NULL,    

--     CONSTRAINT fk_assistant_complaints
--         FOREIGN KEY (Assistant_id)
--         REFERENCES Assistant(Assistant_id)
-- );


-- -- ============================================================
-- -- 25. ADMIN CONTACTS
-- -- PK = (Admin_id, Phone_no)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Admin_Contacts (
--     Admin_id INT,
--     Phone_no VARCHAR(20),  

--     PRIMARY KEY (Admin_id, Phone_no),

--     CONSTRAINT fk_admin_contacts
--         FOREIGN KEY (Admin_id)
--         REFERENCES Admin(Admin_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 26. FEE PAYMENT
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Fee_Payment (
--     Receipt_id INT PRIMARY KEY,
--     Student_id INT,
--     Batch_id INT,   
--     Amount DECIMAL(10,2) NOT NULL, 
--     Payment_date DATE NOT NULL,      
--     Payment_time TIME NOT NULL,  
--     Mode_of_payment VARCHAR(50) NOT NULL, 

--     CONSTRAINT fk_fee_payment_student
--         FOREIGN KEY (Student_id)
--         REFERENCES Student(Student_id)
--         ON DELETE CASCADE,

--     CONSTRAINT fk_fee_payment_batch
--         FOREIGN KEY (Batch_id)
--         REFERENCES Batch(Batch_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 27. FEE DETAILS
-- -- PK = (Receipt_id, Description)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Fee_Details (
--     Receipt_id INT,
--     Description VARCHAR(255), -- Changed from TEXT to VARCHAR(255)

--     PRIMARY KEY (Receipt_id, Description),

--     CONSTRAINT fk_fee_details
--         FOREIGN KEY (Receipt_id)
--         REFERENCES Fee_Payment(Receipt_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 28. ASSISTANT SALARY RECORDS
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Assistant_Salary_Records (
--     Receipt_id INT PRIMARY KEY,
--     Assistant_id INT,
--     Amount DECIMAL(10,2) NOT NULL,   
--     Salary_payment_date DATE NOT NULL,   
--     Month INT NOT NULL,  
--     Year INT NOT NULL,   

--     CONSTRAINT fk_assistant_salary_assistant    
--         FOREIGN KEY (Assistant_id)
--         REFERENCES Assistant(Assistant_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 29. ASSISTANT SALARY DETAILS
-- -- PK = (Receipt_id, Description)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Assistant_Salary_Details (
--     Receipt_id INT,
--     Description VARCHAR(255), -- Changed from TEXT to VARCHAR(255)

--     PRIMARY KEY (Receipt_id, Description),

--     CONSTRAINT fk_assistant_salary_details
--         FOREIGN KEY (Receipt_id)
--         REFERENCES Assistant_Salary_Records(Receipt_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 30. TAKES
-- -- PK = (Student_id, Batch_id, Test_id)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Takes (
--     Student_id INT,
--     Batch_id INT,
--     Test_id INT,
--     Score DECIMAL(5,2),         

--     PRIMARY KEY (Student_id, Batch_id, Test_id),

--     CONSTRAINT fk_takes_student
--         FOREIGN KEY (Student_id)
--         REFERENCES Student(Student_id)
--         ON DELETE CASCADE,

--     CONSTRAINT fk_takes_batch
--         FOREIGN KEY (Batch_id)
--         REFERENCES Batch(Batch_id)
--         ON DELETE CASCADE,

--     CONSTRAINT fk_takes_test
--         FOREIGN KEY (Test_id)
--         REFERENCES Test(Test_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 31. STUDENT MIDDLE NAME
-- -- PK = (Sequence_No, Student_id)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Student_Middle_Name (
--     Sequence_No INT,
--     Student_id INT,
--     Middle_Name VARCHAR(100) NOT NULL,

--     PRIMARY KEY (Sequence_No, Student_id),

--     CONSTRAINT fk_student_middle_name_student
--         FOREIGN KEY (Student_id)
--         REFERENCES Student(Student_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 32. TEACHER MIDDLE NAME
-- -- PK = (Sequence_No, Teacher_id)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Teacher_Middle_Name (
--     Sequence_No INT,
--     Teacher_id INT,
--     Middle_Name VARCHAR(100) NOT NULL,

--     PRIMARY KEY (Sequence_No, Teacher_id),

--     CONSTRAINT fk_teacher_middle_name_teacher
--         FOREIGN KEY (Teacher_id)
--         REFERENCES Teacher(Teacher_id)
-- );


-- -- ============================================================
-- -- 33. ASSISTANT MIDDLE NAME
-- -- PK = (Sequence_No, Assistant_id)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Assistant_Middle_Name (
--     Sequence_No INT,
--     Assistant_id INT,
--     Middle_Name VARCHAR(100) NOT NULL,

--     PRIMARY KEY (Sequence_No, Assistant_id),

--     CONSTRAINT fk_assistant_middle_name
--         FOREIGN KEY (Assistant_id)
--         REFERENCES Assistant(Assistant_id)
--         ON DELETE CASCADE
-- );


-- -- ============================================================
-- -- 34. ADMIN MIDDLE NAME
-- -- PK = (Sequence_No, Admin_id)
-- -- ============================================================

-- CREATE TABLE IF NOT EXISTS Admin_Middle_Name (
--     Sequence_No INT,
--     Admin_id INT ,
--     Middle_Name VARCHAR(100) NOT NULL,

--     PRIMARY KEY (Sequence_No, Admin_id),

--     CONSTRAINT fk_admin_middle_name
--         FOREIGN KEY (Admin_id)
--         REFERENCES Admin(Admin_id)
--         ON DELETE CASCADE
-- );
