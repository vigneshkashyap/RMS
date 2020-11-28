CREATE TABLE "user" (
    u_id SERIAL NOT NULL,
    u_email text NOT NULL,
    u_password text NOT NULL,
    u_role varchar(20) NOT NULL,
    PRIMARY KEY(u_id)
);
create TABLE student (
    s_id INTEGER NOT NULL,
    s_name text NOT NULL,
    s_age INTEGER NOT NULL,
    s_gender varchar(10) NOT NULL,
    s_department text NOT NULL,
    s_email varchar(100) NOT NULL,
    s_pass text NOT NULL,
    PRIMARY KEY (s_id)
);
create TABLE teacher (
    t_id INTEGER NOT NULL,
    t_name text NOT NULL,
    t_age INTEGER NOT NULL,
    t_gender varchar(10) NOT NULL,
    t_department text NOT NULL,
    t_designation varchar(50) NOT NULL,
    t_email varchar(100) NOT NULL,
    t_pass text NOT NULL,
    PRIMARY KEY (t_id)
);
create TABLE course (
    c_id varchar(7) NOT NULL,
    c_name text NOT NULL,
    c_credits INTEGER NOT NULL,
    t_id INTEGER NOT NULL,
    FOREIGN KEY (t_id) REFERENCES teacher (t_id),
    PRIMARY KEY (c_id)
);
create TABLE coursereg (
    c_id varchar(7) NOT NULL,
    s_id INTEGER NOT NULL,
    midsem FLOAT CHECK <=30,
    lab FLOAT CHECK <=15,
    endsem FLOAT CHECK <=40,
    internal FLOAT CHECK <=15,
    request BOOLEAN DEFAULT FALSE,
    show BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (c_id) REFERENCES course (c_id),
    FOREIGN KEY (s_id) REFERENCES student (s_id),
    PRIMARY KEY (c_id, s_id)
);