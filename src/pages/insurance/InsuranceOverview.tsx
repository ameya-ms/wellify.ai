import { Link } from "react-router-dom";
import { Shield, FileText, HelpCircle, Upload, CheckCircle, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import uhcLogo from "@/assets/insurance/uhc-logo.png";
import cignaLogo from "@/assets/insurance/cigna-logo.png";
import medicareLogo from "@/assets/insurance/medicare-logo.png";
import bcbsLogo from "@/assets/insurance/bcbs-logo.png";

const InsuranceOverview = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const insuranceProviders = [
    { name: "Premera Blue Cross", logo: bcbsLogo },
    { name: "Aetna", logo: uhcLogo },
    { name: "UnitedHealthcare", logo: uhcLogo },
    { name: "Regence Blue Cross Blue Shield", logo: bcbsLogo },
    { name: "Cigna", logo: cignaLogo },
    { name: "Anthem Blue Cross Blue Shield", logo: bcbsLogo },
  ];

  const allCarriers = [
    { category: "Popular Carriers", carriers: [
      "Premera Blue Cross", "Aetna", "UnitedHealthcare", "Regence Blue Cross Blue Shield",
      "Cigna", "Anthem Blue Cross Blue Shield", "Blue Cross Blue Shield of Illinois"
    ]},
    { category: "#", carriers: ["1199SEIU", "1st Agency", "20/20 Eyecare Plan"] },
    { category: "A", carriers: [
      "AARP", "ACE", "AIG", "APWU", "ATRIO Health Plans", "AVMA Life", "Absolute Total Care",
      "Access Medicare (NY)", "Accountable Health Plan of Ohio", "Advanced Health", "AdvantageMD",
      "Advantica", "Advent Health", "Adventist Health", "Advocate Health Care", "Aetna",
      "Aetna Better Health", "Affinity Health Plan", "AgeRight Advantage", "AgeWell New York",
      "Agile Health Insurance", "Alameda Alliance for Health", "Aliera Health Care",
      "Alignment Health Plan", "All Savers Insurance", "AllCare Health", "AllState",
      "Allegiance Life and Health", "Alliant Health Plans", "Allianz Worldwide Care", "Allwell",
      "AlohaCare", "AlphaCare", "AltaMed Senior BuenaCare (PACE)", "Alterwood Advantage",
      "Altius (Coventry Health Care)", "AlwaysCare", "Ambetter", "AmeriHealth", "AmeriHealth Caritas",
      "America's 1st Choice", "American Behavioral", "American Eldercare", "American Healthcare Alliance",
      "American Maritime Officers Plans", "American Republic Insurance Company", "Amida Care",
      "Amita Health", "Amplifon Hearing Health Care", "Anthem Blue Cross", "Anthem Blue Cross Blue Shield",
      "Apostrophe", "ArchCare", "Arise Health Plan", "Arizona Complete Health",
      "Arizona Foundation for Medical Care", "Arkansas Blue Cross Blue Shield", "Arkansas Total Care",
      "Ascension Complete", "Ascension Health", "Aspire Health Plan", "Assurant Employee Benefits",
      "Assurant Health", "Asuris Northwest Health", "Aultcare", "AvMed", "Avera Health Plans", "Avesis"
    ]},
    { category: "B", carriers: [
      "BMC HealthNet Plan", "Banker's Life", "Banner Health", "Baptist Health Plan",
      "BayCarePlus Medicare Advantage", "Baylor Scott & White Health Plan", "Beaumont Employee Health Plan",
      "Beech Street", "Best Choice Plus", "Best Doctors Insurance", "Best Life And Health",
      "Better Health (Florida Medicaid)", "Blue Choice Health Plan", "Blue Cross Blue Shield",
      "Blue Cross Blue Shield Federal Employee Program", "Blue Cross Blue Shield of Alabama",
      "Blue Cross Blue Shield of Arizona", "Blue Cross Blue Shield of Georgia",
      "Blue Cross Blue Shield of Illinois", "Blue Cross Blue Shield of Kansas",
      "Blue Cross Blue Shield of Kansas City", "Blue Cross Blue Shield of Louisiana",
      "Blue Cross Blue Shield of Massachusetts", "Blue Cross Blue Shield of Michigan",
      "Blue Cross Blue Shield of Minnesota", "Blue Cross Blue Shield of Mississippi",
      "Blue Cross Blue Shield of Montana", "Blue Cross Blue Shield of Nebraska",
      "Blue Cross Blue Shield of New Mexico", "Blue Cross Blue Shield of North Carolina",
      "Blue Cross Blue Shield of North Dakota", "Blue Cross Blue Shield of Oklahoma",
      "Blue Cross Blue Shield of Rhode Island", "Blue Cross Blue Shield of South Carolina",
      "Blue Cross Blue Shield of Tennessee", "Blue Cross Blue Shield of Texas",
      "Blue Cross Blue Shield of Vermont", "Blue Cross Blue Shield of Wyoming",
      "Blue Cross of Idaho", "Blue Cross of Northeastern Pennsylvania", "Blue Shield of California",
      "Blue Shield of Northeastern New York", "Brand New Day",
      "Braven Health (Horizon Blue Cross Blue Shield of New Jersey)", "BridgeSpan",
      "Bridgeway Health Solutions", "Bright Health", "Buckeye Health Plan"
    ]},
    { category: "C", carriers: [
      "CBA Blue", "CDPHP", "CHAMPVA", "CHP Group", "CHRISTUS Health Plan", "CalOptima", "CalPERS",
      "CalViva Health", "California Foundation for Medical Care", "California Health and Wellness",
      "Calvos", "Cambridge Health Alliance (CHA)", "Capital Blue Cross", "Capital Health Plan",
      "Care Improvement Plus", "Care N' Care", "Care1st", "CareConnect",
      "CareFirst Blue Cross Blue Shield (Health)", "CareMore", "CareOregon",
      "CarePartners of Connecticut", "CarePlus Health Plans (Florida Medicare)", "CareSource",
      "Carelon Behavioral Health (fka Beacon Health)", "Carolina Complete Health",
      "Cascade Health Alliance", "Caterpillar", "CeltiCare Health Plan", "CenCal Health",
      "Cenpatico", "Centennial Care", "Center for Elders' Independence (PACE)",
      "CenterLight Healthcare", "Centers Plan for Healthy Living", "Centivo", "Centra Health",
      "Central California Alliance for Health", "Central Health Plan of California",
      "Century Healthcare - CHC", "Children's Community Health Plan",
      "Children's Medical Center Health Plan", "Children's Medical Services (CMS)",
      "Chinese Community Health Plan", "Choice Care Network", "Christian Healthcare Ministries",
      "Cigna", "Cigna-HealthSpring", "Clarion Health", "Clark County Self-Funded Health",
      "Clear Spring Health", "Clements Worldwide", "Cleveland Clinic Employee Health Plan",
      "Clover Health", "Cofinity", "Colorado Access", "Columbia Pacific CCO",
      "Columbia United Providers", "ComPsych", "Common Ground Healthcare Cooperative",
      "Commonwealth Care Alliance", "Community Behavioral Health",
      "Community Care Alliance of Illinois", "Community Care Associates",
      "Community Care Behavioral Health Organization", "Community Care Plan",
      "Community Care of North Carolina", "Community Eye Care", "Community First Health Plans",
      "Community Health Choice", "Community Health Group", "Community Health Options",
      "Community Health Partners", "Community Health Plan of Washington",
      "CommunityCare of Oklahoma", "CompBenefits", "Companion Life",
      "Comprehensive Health Insurance Plan (CHIP) of Illinois",
      "Comprehensive Medical and Dental Program (CMDP)", "Connect Care", "ConnectiCare",
      "Consolidated Health Plans", "Constitution Life", "Consumer Health Network",
      "Contra Costa Health Plan", "Cook Children's Health Plan", "Coordinated Care Health",
      "Corvel", "CountyCare (Cook County)", "Cox HealthPlans", "Create", "Crystal Run Health Plans",
      "Culinary Health Fund", "CuraLinc Healthcare", "Curative"
    ]},
    { category: "D", carriers: [
      "DC Medicaid", "DMC Care", "DOCS (Doctors of the Oregon South Coast)", "DavidShield",
      "Davis Vision", "Deaconess Health Plans", "Dean Health Plan", "Dell Children's Health Plan",
      "Denver Health Medical Plan", "Department of Medical Assistance Services", "Deseret Mutual",
      "Devon Health Services", "Devoted Health", "Dimension Health", "Doctors HealthCare Plans",
      "Driscoll Health Plan"
    ]},
    { category: "E", carriers: [
      "EHP Significa", "EMI Health", "ESSENCE Healthcare",
      "Eastern Oregon Coordinated Care Organization", "Easy Choice Health Plan (California)",
      "Easy Choice Health Plan of New York", "El Paso First Health Plans", "Elderplan",
      "EmblemHealth", "EmblemHealth (formerly known as GHI)", "EmblemHealth (formerly known as HIP)",
      "Emory Health Care Plan", "Empire Blue Cross Blue Shield (Health)",
      "Empire BlueCross BlueShield HealthPlus", "Empire Plan", "Empower Healthcare Solutions",
      "Encore Health Network", "Envolve Benefit Options", "Eon Health", "Epic Hearing Health Care",
      "Erickson Advantage", "EverCare", "Evergreen Health Cooperative",
      "Evolutions Healthcare Systems", "Excellus Blue Cross Blue Shield", "Experience HealthND",
      "Extended Managed Long Term Care", "EyeMed", "Eyetopia Vision Care"
    ]},
    { category: "F", carriers: [
      "Fallon Community Health Plan (FCHP)", "Family Health Network", "FamilyCare Health Plans",
      "Fidelis Care (NY)", "Firefly Health", "First Choice Health",
      "First Choice Health Plan of Mississippi", "First Health (Coventry Health Care)",
      "FirstCare Health Plans", "FirstCarolinaCare",
      "Florida Blue: Blue Cross Blue Shield of Florida", "Florida Community Care",
      "Florida Health Care Plans", "Florida Health Partners",
      "Florida Hospital Healthcare System (FHHS)", "Florida KidCare",
      "Fort Bend County Indigent Health Care", "Fortified Provider Network", "Freedom Health",
      "Fresenius Health Plans", "Friday Health Plans"
    ]},
    { category: "G", carriers: [
      "GEHA", "GEMCare Health Plan", "GWH-Cigna (formerly Great West Healthcare)", "Galaxy Health",
      "Gateway Health", "Geisinger Health Plan", "General Vision Services (GVS)", "GeoBlue",
      "Georgia Health Advantage", "Gilsbar 360 Alliance", "Global Health", "Gold Coast Health Plan",
      "Golden Rule", "Golden State Medicare Health Plan", "Green Mountain Care (Vermont)",
      "Group Health Cooperative", "Group Health Cooperative of Eau Claire",
      "Group Health Cooperative of South Central Wisconsin", "Guardian", "Guide Stone",
      "Gundersen Health Plan"
    ]},
    { category: "H", carriers: [
      "HAP (Health Alliance Plan)", "HAP Midwest Health Plan", "HFN", "HFS Medical Benefits",
      "HUSKY Health", "Hamaspik Choice", "Harken Health", "Harmony Health Plan",
      "Harvard Pilgrim Health Care", "Hawaii Medical Assurance Association (HMAA)",
      "Hawaii Medical Service Association (HMSA)", "Health Alliance", "Health Choice Arizona",
      "Health First (FL)", "Health First Colorado", "Health First Health Plans (Florida)",
      "Health Net", "Health New England", "Health Partners Plans", "Health Plan of Nevada",
      "Health Plan of San Joaquin", "Health Plan of San Mateo", "Health Plus",
      "Health Share of Oregon", "Health Sun", "HealthChoice Oklahoma",
      "HealthChoice of Michigan", "HealthFirst (NY)", "HealthNow", "HealthPartners",
      "HealthScope Benefits", "HealthSmart", "HealthTeam Advantage",
      "Healthcare Highways Health Plan", "Healthlink", "Healthy Texas Women", "HealthyCT",
      "Hear In America", "Hennepin Health", "Heritage Vision Plans",
      "Highmark Blue Cross Blue Shield", "Highmark Blue Cross Blue Shield of Delaware",
      "Highmark Blue Cross Blue Shield of Western New York", "Highmark Blue Shield",
      "Highmark BlueCross BlueShield of West Virginia", "Hillsborough Health Care Plan",
      "Home State Health Plan", "Hometown Health",
      "Horizon Blue Cross Blue Shield of New Jersey",
      "Horizon Blue Cross Blue Shield of New Jersey For Barnabas Health",
      "Horizon Blue Cross Blue Shield of New Jersey For Novartis", "Horizon NJ Health",
      "Hudson Health Plan", "Humana", "Humana Behavioral Health (LifeSynch)"
    ]},
    { category: "I", carriers: [
      "IHC Health Solutions", "IMS (Independent Medical Systems)",
      "IU Health Plans (Indiana University Health)", "Illinicare Health",
      "Illinois' Primary Care Case Management (PCCM)", "Imagine Health",
      "Imperial Health Plan of California", "Imperial Insurance Company of Texas",
      "InTotal Health", "Independence Blue Cross", "Independence Care System", "Independent Health",
      "Indiana Medicaid", "Inland Empire Health Plan", "Innovation Health", "Integra",
      "Inter Valley Health Plan", "InterCommunity Health Network CCO", "Intergroup Services",
      "Iowa MediPASS", "Iowa Total Care", "Itasca Medical Care"
    ]},
    { category: "J", carriers: [
      "Jackson Care Connect", "Jackson Health Plan", "Jai Medical Systems",
      "Johns Hopkins Employer Health Programs"
    ]},
    { category: "K", carriers: [
      "Kaiser Permanente", "Kansas HealthWave", "Kansas Superior Select",
      "KelseyCare Advantage", "Keystone First"
    ]},
    { category: "L", carriers: [
      "L.A. Care Health Plan", "Land of Lincoln Health", "Landmark Healthplan", "Lasso Healthcare",
      "Legacy Health", "Lehigh Valley Health Network Health Plan", "Leon Medical Centers Health Plans",
      "Liberty Health Advantage", "Liberty HealthShare", "Liberty Mutual", "LifeWise",
      "Lifestyle Health", "Lighthouse Guild", "Lighthouse Health Plan", "Lincoln Financial Group",
      "Live360 Health Plan", "Longevity Health Plan", "Louisiana Healthcare Connections",
      "Lutheran Preferred", "Lyra Health"
    ]},
    { category: "M", carriers: [
      "MCM Maxcare", "MDwise", "MHNet Behavioral Health", "MINES & Associates",
      "MMM of Florida (Medicare and Much More)", "MO HealthNet",
      "MOAA (Miltary Officers Association of America)", "MVP Health Care", "Magellan Health",
      "MagnaCare", "Magnolia Health Plan", "Mail Handlers Benefit Plan", "MaineCare",
      "Managed Health Network (MHN)", "Managed Health Services (Indiana)",
      "Managed Health Services (Wisconsin)", "Managed HealthCare Northwest", "March Vision Care",
      "Martin's Point HealthCare", "Maryland Medical Assistance (Medicaid)",
      "Maryland Physicians Care", "Mass General Brigham Health Plan", "MassHealth",
      "Massachusetts Laborers' Health & Welfare Fund", "Mayo Medical Plan", "McLaren Health Plan",
      "MedStar Family Choice", "MedStar Select", "Medi-Cal", "MediGold", "MediPass", "Medica",
      "Medica HealthCare Plans (Florida)", "Medicaid", "Medical Associates Health Plans",
      "Medical Eye Services (MES Vision)", "Medical Mutual", "Medicare",
      "Memorial Healthcare System", "Memorial Hermann", "Mercy Care", "Meridian Health Plan",
      "Meritain Health", "MetLife", "MetroHealth", "MetroPlus Health Plan",
      "Miami Children's Health Plan", "Michigan Complete Health", "Michigan No-Fault",
      "Minuteman Health", "Mississippi Division of Medicaid", "Missouri Care", "Moda Health",
      "Molina Healthcare", "Montana Health Cooperative", "Montefiore HMO", "MoreCare",
      "Mountain Health Co-Op", "Multiplan PHCS", "Mutual of Omaha"
    ]},
    { category: "N", carriers: [
      "NALC Health Benefit Plan", "NECA/IBEW Family Medical Care Plan", "NY State No-Fault",
      "NY: YourCare Health Plan", "Nascentia Health", "National Congress of Employers (NCE)",
      "National Vision Administrators", "Nationwide", "Navajo Nation",
      "Nebraska Total Care (Heritage Health)", "Neighborhood Health Plan (Massachusetts)",
      "Neighborhood Health Plan of Rhode Island", "Neighborhood Health Providers (NY)",
      "Network Health Plan", "Nevada Preferred", "New Directions Behavioral Health",
      "New Hampshire Healthy Families", "New Mexico Health Connections",
      "New York Hotel Trades Council", "NextLevelHealth", "Nippon Life Benefits",
      "North Shore LIJ CareConnect", "Northland PACE", "Northwell Direct", "NovaNet"
    ]},
    { category: "O", carriers: [
      "OSU Health Plan", "Ohio Health Choice", "OhioHealthy", "On Lok Lifeways",
      "On Lok Lifeways (PACE)", "OneNet PPO", "Opticare of Utah", "Optimum HealthCare",
      "Optum", "Oscar Health Insurance Co."
    ]},
    { category: "P", carriers: [
      "PA Health and Wellness", "PBA (Patrolmen's Benefit Association)", "POMCO",
      "Pacific Health Alliance", "PacificSource Health Plans", "Palmetto GBA",
      "Pan-American Life Insurance Group", "Paradigm Senior Care Advantage",
      "Paramount Healthcare", "Parkland Community Health Plan", "Parkview Total Health",
      "Partners Health Plan", "Partnership HealthPlan of California",
      "Passport Health Plan (Kentucky)", "Passport To Health (Montana Medicaid)",
      "Patient 1st (Alabama Medicaid)", "Peach State Health Plan", "PeachCare for Kids",
      "PennCare", "Peoples Health", "Phoenix Health Plan",
      "Physician Assured Access System", "Physicians Health Plan",
      "Physicians Health Plan of Northern Indiana, Inc.", "PhysiciansCare",
      "Piedmont Community Health Plan", "Piedmont WellStar Health Plans",
      "Positive Health Care", "Preferential Care Network", "Preferred Care Partners",
      "PreferredOne", "Premera Blue Cross", "Premier Health Plan",
      "Presbyterian Health Plan/Presbyterian Insurance Company", "Prestige Health Choice",
      "Primary Care Case Management (North Dakota Medicaid)",
      "Prime Health Services, Inc", "Prime Healthcare", "PrimeWest Health",
      "Principal Financial Group", "Priority Health", "Priority Partners",
      "ProCare Advantage", "Progressive", "Prominence Health Plan",
      "ProviDRs Care (WPPA)", "Providence Health Plans", "Provider Partners Health Plan",
      "PruittHealth Premier", "Public Aid (Illinois Medicaid)",
      "Public Employees Health Program (PEHP)", "Puget Sound Electrical Workers Trusts"
    ]},
    { category: "Q", carriers: [
      "QualCare", "QualChoice Arkansas", "Quality Health Plans of New York", "Quartz",
      "Quest Behavioral Health", "Quiktrip"
    ]},
    { category: "R", carriers: [
      "Regence Blue Cross Blue Shield", "Regence Blue Shield of Washington",
      "Reliance Medicare Advantage", "Renaissance", "RiverLink Health",
      "RiverSpring Health Plans", "RiverSpring at Home", "Riverside Health",
      "Rockefeller Health Plan", "Rocky Mountain Health Plans"
    ]},
    { category: "S", carriers: [
      "SAG AFTRA Health Plan", "SAMBA", "SCAN Health Plan", "SIHO Insurance Services",
      "SSM Health Care", "Sagamore Health Network", "Samaritan Health Plan Operations",
      "San Francisco Health Plan", "Sana", "Sanford Health Plan",
      "Santa Clara Family Health Plan", "Security Health Plan of Wisconsin, Inc.",
      "Select Care", "Select Health Network", "Select Health of South Carolina",
      "SelectHealth", "Sendero Health Plans", "Senior Dimensions", "Senior Whole Health",
      "Sentara Health Plans (formerly Optima Health)", "Seton Health Plan", "Sharp Health Plan",
      "Sierra Health and Life", "SightCare", "SilverSummit Healthplan", "Simply Healthcare",
      "Simpra Advantage", "Solis Health Plans", "Solstice", "Sonder Health Plans",
      "SoonerCare (Oklahoma Medicaid)", "Soundpath Health", "South Country Health Alliance",
      "South Florida Community Care Network", "Southwestern Health Resources (SWHR)", "Spectera",
      "St. Luke's Health Plan", "Standard Life and Accident Insurance Company",
      "Stanford Health Care Advantage", "State Farm®", "Staywell Insurance",
      "Steward Health Care Network - Health Choice Arizona", "Steward Health Choice",
      "Stratose", "SummaCare", "Summit Community Care", "Sunflower Health Plan",
      "Sunrise Advantage Plan", "Sunshine Health", "Superior HealthPlan", "Superior Vision",
      "Surest Health Plans (formerly Bind)", "Sutter Health Plus", "SutterSelect"
    ]},
    { category: "T", carriers: [
      "TakeCare", "Teachers Health Trust", "TexanPlus", "Texas Children's Health Plan",
      "Texas Health Aetna", "Texas Independence Health Plan (TIHP)", "Texas Kids First",
      "The HSC Health Care System", "The Hartford",
      "The Health Plan of the Upper Ohio Valley, Inc.",
      "Three Rivers Providers Network (TRPN)", "Total Health Care", "Touchstone",
      "Transamerica", "Travelers", "Tricare", "Trillium Community Health Plan",
      "Trilogy Health Insurance", "Triple-S Salud: Blue Cross Blue Shield of Puerto Rico",
      "Triwest Healthcare Alliance", "Troy Health", "TrueHealth New Mexico", "Trusted Health Plan",
      "Tuality Health Alliance", "Tufts Health Freedom Plan", "Tufts Health Plan"
    ]},
    { category: "U", carriers: [
      "UCHP (University of Chicago Health Plan)", "UCare", "UHA Health Insurance",
      "UPMC Health Plan", "US Family Health Plan", "US Health Group",
      "USA Managed Care Organization", "USAble Mutual Insurance Company",
      "Ultimate Health Plans", "Umpqua Health Alliance", "UniCare", "Uniform Medical Plan",
      "Union Eye Care", "Union Health Services, Inc", "Union Plans", "United American",
      "United Behavioral Health", "UnitedHealthOne", "UnitedHealthcare",
      "UnitedHealthcare Community Plan", "UnitedHealthcare Oxford", "UnitedHealthcare UMR",
      "Unity Health Insurance", "Univera Healthcare", "Universal American",
      "Universal Healthcare", "University Hospitals (Health Design Plus)",
      "University Physician Network (UPN)", "University of Arizona Health Plans",
      "University of Maryland Health Advantage", "University of Maryland Health Partners",
      "University of St. Mary of the Lake - Mundelein Seminary",
      "University of Utah Health Plans", "Upper Peninsula Health Plan"
    ]},
    { category: "V", carriers: [
      "VNS Choice Health Plans", "VSP", "Valley Health Plan", "Valor Health Plan",
      "Vantage Health Plan, Inc.", "Ventura County Health Care Plan", "Verda Health Plan of Texas",
      "Vibra Health Plan", "VillageCareMax", "Virginia Coordinated Care (VCC)",
      "Virginia Health Network", "Virginia Premier Health Plan", "Vision Benefits of America",
      "Vision Care Direct", "Vision Plan of America", "Viva Health Plan", "Vivida Health",
      "Volusia Health Network", "Vytra"
    ]},
    { category: "W", carriers: [
      "WEA Trust", "WPS Health Plan", "WellFirst Health", "WellSense Health Plan", "Wellcare",
      "Wellmark Blue Cross Blue Shield", "Wellpoint (formerly Amerigroup)",
      "West Virginia Senior Advantage", "Western Health Advantage", "Western Sky Community Care",
      "Willamette Valley Community Health", "Workers' Compensation"
    ]},
    { category: "Y", carriers: ["Yamhill Community Care Organization"] },
    { category: "Z", carriers: ["Zenith", "Zing Health"] }
  ];

  const filteredCarriers = allCarriers.map(group => ({
    ...group,
    carriers: group.carriers.filter(carrier => 
      carrier.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.carriers.length > 0);

  const coverageHighlights = [
    {
      title: "Hall Health Visits",
      coverage: "$20 copay",
      description: "Primary care and same-day appointments",
      color: "bg-success/10 text-success border-success/20",
    },
    {
      title: "UW Medical Center",
      coverage: "80% covered",
      description: "After $500 deductible",
      color: "bg-primary/10 text-primary border-primary/20",
    },
    {
      title: "Emergency Room",
      coverage: "100% covered",
      description: "For true emergencies",
      color: "bg-accent/10 text-accent-foreground border-accent/30",
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="relative text-center mb-16 space-y-4 animate-fade-in-up">
          <div className="absolute inset-0 -z-10 opacity-10 rounded-2xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Insurance Overview
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your UW student health insurance at a glance
            </p>
          </div>
        </div>

        {/* Insurance Card Upload */}
        <Card className="mb-8 border-border animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Your Insurance Plan
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upload your insurance card or select your plan to get personalized coverage information.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Card
                </Button>
                <Button className="hover:scale-105 transition-transform">
                  Select Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Providers */}
        <Card className="mb-12 border-border animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-semibold text-foreground">Select Your Insurance Provider</h3>
                <p className="text-muted-foreground">Click on your insurance provider to see in-network doctors and coverage details</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {insuranceProviders.map((provider, index) => (
                  <Card 
                    key={provider.name}
                    onClick={() => setSelectedProvider(provider.name)}
                    className={cn(
                      "border-2 transition-all cursor-pointer group relative overflow-hidden",
                      selectedProvider === provider.name 
                        ? "border-primary shadow-lg shadow-primary/30 scale-105" 
                        : "border-border/50 hover:border-primary/50 hover:shadow-lg hover:scale-105"
                    )}
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                  >
                    <CardContent className="p-0 relative">
                      {selectedProvider === provider.name && (
                        <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <div className="aspect-square flex items-center justify-center bg-white/5 p-6 group-hover:bg-white/10 transition-colors">
                        <img 
                          src={provider.logo} 
                          alt={provider.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/95 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-xs font-medium text-foreground text-center line-clamp-2">{provider.name}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center space-y-4 pt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-primary hover:text-primary/80">
                      See all (1,000+) providers
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">All Insurance Carriers</DialogTitle>
                      <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search carriers..."
                          className="pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </DialogHeader>
                    <div className="overflow-y-auto flex-1 mt-4 space-y-6 pr-4">
                      {filteredCarriers.map((group) => (
                        <div key={group.category}>
                          <h3 className="text-lg font-semibold text-primary mb-3 sticky top-0 bg-background z-10 pb-2">
                            {group.category}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {group.carriers.map((carrier) => (
                              <Button
                                key={carrier}
                                variant="ghost"
                                className="justify-start text-left h-auto py-2 px-3 hover:bg-primary/10"
                              >
                                {carrier}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                <div>
                  {selectedProvider ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-success">
                        <CheckCircle className="w-5 h-5" />
                        <p className="font-medium">Selected: {selectedProvider}</p>
                      </div>
                      <Button size="lg" className="hover:scale-105 transition-transform">
                        Continue with {selectedProvider}
                      </Button>
                    </div>
                  ) : (
                    <Button size="lg" variant="outline" className="hover:scale-105 transition-transform">
                      <Plus className="w-4 h-4 mr-2" />
                      Or manually enter your insurance
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coverage Highlights */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Coverage Highlights</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {coverageHighlights.map((item, index) => (
              <Card 
                key={item.title} 
                className="border-border hover:shadow-lg transition-all animate-fade-in-up"
                style={{ animationDelay: `${(index + 5) * 100}ms` }}
              >
                <CardContent className="p-6 space-y-3">
                  <Badge className={item.color}>
                    {item.title}
                  </Badge>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-foreground">{item.coverage}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/insurance/plans">
            <Card className="border-border hover:shadow-xl transition-all cursor-pointer group hover:scale-105 duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  View Plan Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  See detailed coverage information for all UW health facilities and services.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/insurance/faq">
            <Card className="border-border hover:shadow-xl transition-all cursor-pointer group hover:scale-105 duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-5 h-5 text-accent-foreground" />
                  </div>
                  Common Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Find answers to frequently asked questions about your insurance coverage.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InsuranceOverview;
