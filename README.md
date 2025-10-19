# Wellify.ai

A comprehensive healthcare platform that provides personalized health recommendations, medication management, and convenient delivery services for your wellness needs.

## 🏥 Features

### Health Assessment & Recommendations
- **Personalized Health Dashboard**: Get tailored health insights based on your symptoms and conditions
- **Symptom Checker**: Advanced AI-powered symptom analysis with professional recommendations
- **Health Tracking**: Monitor your health metrics and progress over time

### Medication Management
- **Prescription Management**: View and manage your prescriptions with refill tracking
- **Pharmacy Integration**: Order medications through Amazon Pharmacy and Walgreens
- **Medication Reminders**: Never miss a dose with smart notifications

### Convenient Delivery Services
- **DoorDash Integration**: Order comfort items and supplies directly through the app
- **Instacart Integration**: Get groceries and health essentials delivered
- **Contactless Delivery**: Safe, secure delivery options for all your health needs

### Smart Recommendations
- **Comfort Items**: AI-suggested comfort items based on your condition
- **Nutritional Support**: Personalized food and beverage recommendations
- **Recovery Planning**: Comprehensive recovery plans tailored to your needs

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wellify.ai.git
   cd wellify.ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8000` (or the port shown in your terminal)

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Hooks
- **Form Handling**: React Hook Form with Zod validation

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── DoorDashOrder/  # DoorDash integration
│   └── PrescriptionCardDetails/ # Prescription management
├── pages/              # Application pages
│   ├── Home.tsx        # Dashboard and health overview
│   ├── Meds.tsx        # Medications and supplies
│   └── NotFound.tsx    # 404 page
├── services/           # API services and integrations
├── assets/             # Images and static files
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Components

### Health Dashboard
- Personalized health insights
- Symptom tracking and analysis
- Progress monitoring

### Medication Management
- Prescription tracking with refill counts
- Multiple pharmacy integrations
- Cost and copay information

### Delivery Services
- DoorDash integration for comfort items
- Instacart integration for groceries
- Real-time order tracking

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/wellify.ai/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Roadmap

- [ ] Telemedicine integration
- [ ] Health insurance verification
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Integration with wearable devices

---

**Wellify.ai** - Your comprehensive health companion for a better tomorrow.