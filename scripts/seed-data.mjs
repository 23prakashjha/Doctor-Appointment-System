import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(__dirname, '../client/src/data')

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const specializations = [
  'General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Orthopedic',
  'Gynecologist', 'Neurologist', 'Psychiatrist', 'Oncologist', 'Endocrinologist',
  'Gastroenterologist', 'Pulmonologist', 'Nephrologist', 'Urologist', 'Rheumatologist',
  'Ophthalmologist', 'ENT Specialist', 'Anesthesiologist', 'Radiologist', 'Pathologist',
  'Dentist', 'Dietitian', 'Physiotherapist', 'Psychologist'
]

const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
  'Fort Worth', 'Columbus', 'Charlotte', 'Indianapolis', 'San Francisco', 'Seattle',
  'Denver', 'Nashville', 'Oklahoma City', 'El Paso', 'Washington', 'Boston',
  'Las Vegas', 'Portland', 'Memphis', 'Louisville', 'Baltimore', 'Milwaukee'
]

const clinicNames = [
  'City Medical Center', 'Advanced Health Institute', 'Premier Care Clinic',
  'Wellness First Hospital', 'Mercy Health Center', 'Pinnacle Medical Group',
  'Apex Healthcare', 'VitalCare Clinic', 'Prime Health Services',
  'Elite Medical Center', 'Harmony Health Clinic', 'Pulse Medical Institute',
  'NovaCare Health', 'Summit Medical Group', 'Legacy Health Center',
  'Crown Medical Clinic', 'Shield Healthcare', 'Aspire Medical Center',
  'TruCare Health', 'Vertex Medical Institute'
]

const qualifications = [
  'MBBS, MD', 'MBBS, MS', 'MBBS, MD, DM', 'MBBS, MS, MCh',
  'MBBS, MD, DNB', 'MBBS, MS, DNB', 'DO, DNB', 'MBBS, MD, PhD',
  'MBBS, MS, Fellowship', 'MBBS, MD, MRCP'
]

const languages = [
  ['English', 'Spanish'], ['English', 'French'], ['English', 'Mandarin'],
  ['English', 'Hindi'], ['English', 'Arabic'], ['English', 'Korean'],
  ['English', 'Russian'], ['English', 'Portuguese'], ['English', 'Italian', 'Spanish'],
  ['English', 'German'], ['English', 'Japanese'], ['English', 'Bengali'],
  ['English', 'Urdu'], ['English', 'Tamil'], ['English', 'Telugu'],
  ['English', 'Marathi'], ['English', 'Gujarati'], ['English', 'Spanish', 'French']
]

const firstNames = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Lisa', 'Daniel', 'Nancy',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Dorothy', 'Paul', 'Kimberly', 'Andrew', 'Emily', 'Joshua', 'Donna',
  'Kenneth', 'Michelle', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
  'Timothy', 'Deborah', 'Ronald', 'Stephanie', 'Edward', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
  'Nicholas', 'Angela', 'Eric', 'Shirley', 'Jonathan', 'Anna', 'Stephen', 'Brenda',
  'Larry', 'Pamela', 'Justin', 'Emma', 'Scott', 'Nicole', 'Brandon', 'Helen',
  'Benjamin', 'Samantha', 'Samuel', 'Katherine', 'Raymond', 'Christine', 'Gregory', 'Debra',
  'Frank', 'Rachel', 'Alexander', 'Carolyn', 'Patrick', 'Janet', 'Jack', 'Maria',
  'Dennis', 'Heather', 'Jerry', 'Diane', 'Tyler', 'Julie', 'Aaron', 'Joyce',
  'Jose', 'Victoria', 'Nathan', 'Kelly', 'Henry', 'Christina', 'Douglas', 'Lauren',
  'Peter', 'Frances', 'Adam', 'Martha', 'Zachary', 'Ann', 'Walter', 'Judith',
  'Kyle', 'Cheryl', 'Harold', 'Megan', 'Carl', 'Andrea', 'Jeremy', 'Olivia',
  'Gerald', 'Ann', 'Keith', 'Jean', 'Roger', 'Alice', 'Arthur', 'Jacqueline',
  'Terry', 'Hannah', 'Lawrence', 'Doris', 'Sean', 'Kathryn', 'Christian', 'Debbie',
  'Ethan', 'Sara', 'Hayden', 'Aiden', 'Mason', 'Evelyn', 'Logan', 'Abigail',
  'Lucas', 'Ella', 'Owen', 'Avery', 'Carter', 'Scarlett', 'Jayden', 'Grace',
  'Oliver', 'Chloe', 'Elijah', 'Sophia', 'Grayson', 'Zoey', 'Jameson', 'Lily',
  'Wayne', 'Clara', 'Derek', 'Violet', 'Russell', 'Lucy', 'Vincent', 'Eliana',
  'Miguel', 'Ivy', 'Chase', 'Stella', 'Dylan', 'Aurora', 'Tanner', 'Naomi'
]

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill',
  'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell',
  'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz',
  'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales',
  'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson',
  'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward',
  'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennet', 'Gray',
  'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel',
  'Myers', 'Long', 'Ross', 'Foster', 'Jimenez', 'Powell', 'Jenkins', 'Perry',
  'Russell', 'Sullivan', 'Bell', 'Coleman', 'Butler', 'Henderson', 'Barnes', 'Coleman'
]

const blogTitles = [
  'Understanding Heart Health: A Comprehensive Guide',
  'The Future of Telemedicine in Modern Healthcare',
  '10 Tips for Maintaining Mental Wellness',
  'Managing Diabetes: Diet and Lifestyle Changes',
  'The Importance of Regular Health Checkups',
  'Childhood Vaccinations: What Every Parent Should Know',
  'Breaking the Stigma Around Mental Health',
  'How to Choose the Right Doctor for You',
  'The Role of Nutrition in Preventive Healthcare',
  'Understanding Your Blood Work: A Patient Guide',
  'Sleep Hygiene: The Foundation of Good Health',
  'Allergy Season: Symptoms and Treatment Options',
  'The Benefits of Regular Exercise for Heart Health',
  'Cancer Screening: When and Why You Should Get Tested',
  'Managing Chronic Pain Without Medication',
  'The Gut-Brain Connection: How Digestion Affects Mood',
  'Understanding Antibiotic Resistance',
  'Yoga and Meditation for Stress Relief',
  'The Impact of Climate Change on Public Health',
  'Digital Detox: Reclaiming Your Mental Space',
  'First Aid Basics Everyone Should Know',
  'Managing High Blood Pressure Naturally',
  'The Science Behind Intermittent Fasting',
  'Posture Correction: A Guide to Spinal Health',
  'Understanding Pediatric Milestones',
  'Women Health: Essential Screenings by Age',
  'The Dangers of Sitting Too Long',
  'Hydration: The Elixir of Life',
  'Skin Care Routine for Different Age Groups',
  'Understanding Health Insurance Plans',
  'The Benefits of Walking 10,000 Steps a Day',
  'How to Build a Strong Immune System',
  'Dental Hygiene: More Than Just Brushing',
  'The Link Between Stress and Heart Disease',
  'Vaccine Myths vs Facts',
  'Preparing for Your First Colonoscopy',
  'Living with Asthma: Tips and Tricks',
  'Understanding Hormonal Changes in Menopause',
  'The Power of Positive Thinking in Healing',
  'Workplace Ergonomics: Protecting Your Health',
  'Seasonal Affective Disorder: Causes and Treatments',
  'How Sleep Affects Your Weight',
  'The Benefits of Vitamin D',
  'Understanding Your Thyroid Health',
  'Managing Anxiety in a Fast-Paced World',
  'The Importance of Community Health Programs',
  'Healthy Aging: Tips for Senior Citizens',
  'Understanding Pediatric Nutrition',
  'The Role of Genetics in Disease Prevention',
  'Mindful Eating: A Path to Better Health'
]

const blogSummaries = [
  'Discover essential tips and expert advice on maintaining optimal health and wellness in your daily life.',
  'Learn about the latest advancements in healthcare technology and how they are transforming patient care.',
  'Expert insights on common health concerns, preventive measures, and treatment options for better living.',
  'A comprehensive overview of modern medical practices and holistic approaches to healthcare management.',
  'Practical guidance on navigating the healthcare system and making informed decisions about your health.',
  'Evidence-based information on various health topics to help you lead a healthier, happier life.',
  'Understanding complex medical conditions explained in simple terms for patients and caregivers.',
  'Latest research and developments in the medical field that could impact your health decisions.',
]

const categories = ['General Health', 'Mental Health', 'Nutrition', 'Disease Prevention', 'Women Health', 'Men Health', 'Pediatrics', 'Senior Health', 'Fitness', 'Wellness']

const specializationsArr = [...specializations]

// Generate Doctors
console.log('Generating 500+ doctors...')
const doctors = []
for (let i = 1; i <= 520; i++) {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)]
  const last = lastNames[Math.floor(Math.random() * lastNames.length)]
  const spec = specializationsArr[Math.floor(Math.random() * specializationsArr.length)]
  const city = cities[Math.floor(Math.random() * cities.length)]
  const clinic = clinicNames[Math.floor(Math.random() * clinicNames.length)]
  const qual = qualifications[Math.floor(Math.random() * qualifications.length)]
  const lang = languages[Math.floor(Math.random() * languages.length)]
  const exp = Math.floor(Math.random() * 35) + 3
  const fee = Math.floor(Math.random() * 1500) + 300
  const rating = +(Math.random() * 1.5 + 3.5).toFixed(1)
  const reviews = Math.floor(Math.random() * 200) + 10
  const available = Math.random() > 0.15

  doctors.push({
    id: i,
    name: `Dr. ${first} ${last}`,
    specialization: spec,
    qualification: qual,
    experience: exp,
    consultationFee: fee,
    clinicName: clinic,
    clinicAddress: `${Math.floor(Math.random() * 9999) + 100} ${['Main St', 'Medical Blvd', 'Health Ave', 'Wellness Dr', 'Care Ln'][Math.floor(Math.random() * 5)]}, ${city}`,
    city,
    workingHours: `${['Mon-Fri', 'Mon-Sat', 'Tue-Sun'][Math.floor(Math.random() * 3)]}: ${['9AM-5PM', '8AM-6PM', '10AM-7PM', '9AM-8PM'][Math.floor(Math.random() * 4)]}`,
    bio: `Dr. ${first} ${last} is a highly experienced ${spec.toLowerCase()} with over ${exp} years of practice. ${qual} qualified and dedicated to providing compassionate, evidence-based care to every patient.`,
    languages: lang,
    rating,
    reviewCount: reviews,
    isAvailable: available,
    isApproved: true,
    image: `https://ui-avatars.com/api/?name=${first}+${last}&background=10b981&color=fff&size=200&bold=true`
  })
}

fs.writeFileSync(path.join(dataDir, 'doctors.json'), JSON.stringify({ doctors, total: doctors.length }, null, 2))
console.log(`✓ Created ${doctors.length} doctors`)

// Generate Blogs
console.log('Generating 100+ blog posts...')
const blogs = []
for (let i = 1; i <= 120; i++) {
  const title = blogTitles[Math.floor(Math.random() * blogTitles.length)]
  const summary = blogSummaries[Math.floor(Math.random() * blogSummaries.length)]
  const category = categories[Math.floor(Math.random() * categories.length)]
  const author = doctors[Math.floor(Math.random() * doctors.length)].name
  const daysAgo = Math.floor(Math.random() * 365)
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  const readTime = Math.floor(Math.random() * 12) + 3
  const likes = Math.floor(Math.random() * 500) + 20
  const comments = Math.floor(Math.random() * 80) + 2

  blogs.push({
    id: i,
    title: i > 50 ? `${title} - Part ${Math.ceil(i / 50)}` : title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${i}`,
    summary,
    content: `${summary}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n## Key Takeaways\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n## Understanding the Basics\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\n### Important Considerations\n\n1. First, always consult with your healthcare provider\n2. Maintain a balanced approach to health\n3. Regular checkups are essential\n4. Stay informed about your health conditions\n\n## Conclusion\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`,
    category,
    author,
    date: date.toISOString(),
    readTime,
    likes,
    comments,
    image: `https://images.unsplash.com/photo-${['1498837167922-ddd27525d352', '1551074425-e8e64f8c6b8e', '1532938916866-9f1a7a9b9a9c', '1571019113249-2aa6a3f1a3b9', '1519494023463-6d2b1be10c9c', '1505751172876-fa1923a75e3f', '1576091160550-2173dba999ef', '1544367567-0f2fcb009e0b', '1559757175-5700dde675bc', '1576765608496-4dabc1f5b3b1'][Math.floor(Math.random() * 10)]}?w=800&q=80`,
    tags: [category, 'Healthcare', 'Wellness', 'Medical'].slice(0, Math.floor(Math.random() * 3) + 2)
  })
}

fs.writeFileSync(path.join(dataDir, 'blogs.json'), JSON.stringify({ blogs, total: blogs.length }, null, 2))
console.log(`✓ Created ${blogs.length} blog posts`)
console.log(`\nData saved to: ${dataDir}`)
