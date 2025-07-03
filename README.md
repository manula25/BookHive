# 📚 BookHive

BookHive is a simple full-stack web application for managing a list of books. Users can add, view, update, and delete book records. The frontend is developed with **Angular**, and the backend is built using **ASP.NET Core (C#)**.

---

## 🧩 Technologies Used

### Frontend:
- Angular
- TypeScript
- HTML & CSS

### Backend:
- ASP.NET Core Web API
- C#

---

## 📁 Project Structure

```
BookHive/
├── BookHive-Frontend/        # Angular frontend application
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── ...
│
├── BookHive-Backend/         # ASP.NET Core backend application
│   ├── Controllers/
│   ├── Models/
│   ├── Program.cs
│   ├── Startup.cs
│   └── ...
│
├── README.md
└── .gitignore
```

---

## 📝 Book Model

The `Book` model contains the following properties:

```csharp
public class Book
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Author { get; set; }
    public string ISBN { get; set; }
    public DateTime PublicationDate { get; set; }
    public string CoverUrl { get; set; }
    public string Genre { get; set; }
    public double Rating { get; set; }
    public string Description { get; set; }
}

```

---

## 🚀 How to Run the Project

### 🖥️ Backend (ASP.NET Core)

1. Navigate to the backend directory:
```
cd BookHive-Backend
```

2. Run the backend:
```
dotnet run
```

3. The API will be available at:
```
https://localhost:5001/api/books
```

---

### 🌐 Frontend (Angular)

1. Navigate to the frontend directory:
```
cd BookHive-Frontend
```

2. Install dependencies:
```
npm install
```

3. Run the frontend app:
```
ng serve
```

4. Open your browser at:
```
http://localhost:4200
```

✅ Make sure the backend is running to allow the frontend to connect and perform CRUD operations.

---

## 📦 Deployment / Submission Notes

- `node_modules`, build files, and environment configs are excluded via `.gitignore`.
- Both frontend and backend reside in a single repository.
- Ensure all dependencies are restored before running the application.

---

## 👨‍💻 Developed By

**Deelaka Senal**
