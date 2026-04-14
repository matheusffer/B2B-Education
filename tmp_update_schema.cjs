const fs = require('fs');

const schemaPath = 'c:\\Users\\fmath\\OneDrive\\Documentos\\Projeto\\B2B-Education\\B2B-Education\\prisma\\schema.prisma';
let schema = fs.readFileSync(schemaPath, 'utf8');

// The new models string
const newModels = `
// ==========================================
// KNOWLEDGE-PLATFORM DB MIGRATION MODELS
// ==========================================

model ContentVersion {
  id          String   @id @default(uuid()) @db.Uuid
  tenantId    String   @db.Uuid
  contentId   String   @db.Uuid
  version     Int
  title       String
  description String?  @db.Text
  fileUrl     String?  @db.Text
  changedById String   @db.Uuid
  changeNote  String?  @db.Text
  createdAt   DateTime @default(now())

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  content     Content  @relation("ContentVersions", fields: [contentId], references: [id], onDelete: Cascade)
  changedBy   User     @relation("UserContentVersions", fields: [changedById], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([contentId])
}

model ContentView {
  id          String   @id @default(uuid()) @db.Uuid
  tenantId    String   @db.Uuid
  contentId   String   @db.Uuid
  userId      String   @db.Uuid
  timeSpent   Int      @default(0)
  completedAt DateTime?
  createdAt   DateTime @default(now())

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  content     Content  @relation(fields: [contentId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([contentId])
  @@index([userId])
}

model ContentFavorite {
  id          String   @id @default(uuid()) @db.Uuid
  tenantId    String   @db.Uuid
  contentId   String   @db.Uuid
  userId      String   @db.Uuid
  createdAt   DateTime @default(now())

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  content     Content  @relation(fields: [contentId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([userId])
}

model ContentRating {
  id          String   @id @default(uuid()) @db.Uuid
  tenantId    String   @db.Uuid
  contentId   String   @db.Uuid
  userId      String   @db.Uuid
  rating      Int
  comment     String?  @db.Text
  createdAt   DateTime @default(now())

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  content     Content  @relation(fields: [contentId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([userId])
}

// ─── Quizzes & Assessments ────────────────────────────────────────────────────
model Quiz {
  id                 String   @id @default(uuid()) @db.Uuid
  tenantId           String   @db.Uuid
  title              String
  description        String?  @db.Text
  type               String   @default("quick") // "quick", "final", "retention"
  authorId           String   @db.Uuid
  passingScore       Float    @default(70)
  maxAttempts        Int      @default(3)
  timeLimit          Int?
  showFeedback       Boolean  @default(true)
  showCorrectAnswers Boolean  @default(false)
  shuffleQuestions   Boolean  @default(false)
  points             Int      @default(0)
  retentionDays      Int?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  tenant             Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  author             User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  questions          QuizQuestion[]
  attempts           QuizAttempt[]

  @@index([tenantId])
}

model QuizQuestion {
  id          String   @id @default(uuid()) @db.Uuid
  tenantId    String   @db.Uuid
  quizId      String   @db.Uuid
  text        String   @db.Text
  type        String   @default("multiple_choice")
  explanation String?  @db.Text
  order       Int
  points      Int      @default(1)
  createdAt   DateTime @default(now())

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  quiz        Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  options     QuizOption[]
  answers     QuizAnswer[]

  @@index([tenantId])
  @@index([quizId])
}

model QuizOption {
  id          String   @id @default(uuid()) @db.Uuid
  tenantId    String   @db.Uuid
  questionId  String   @db.Uuid
  text        String   @db.Text
  isCorrect   Boolean  @default(false)
  order       Int

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  question    QuizQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)
  answers     QuizAnswer[]

  @@index([tenantId])
  @@index([questionId])
}

model QuizAttempt {
  id          String   @id @default(uuid()) @db.Uuid
  tenantId    String   @db.Uuid
  quizId      String   @db.Uuid
  userId      String   @db.Uuid
  trailItemId String?  @db.Uuid
  score       Float?
  passed      Boolean?
  timeSpent   Int?
  startedAt   DateTime @default(now())
  completedAt DateTime?
  createdAt   DateTime @default(now())

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  quiz        Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  trailItem   TrailItem? @relation(fields: [trailItemId], references: [id], onDelete: SetNull)
  answers     QuizAnswer[]

  @@index([tenantId])
  @@index([quizId])
  @@index([userId])
}

model QuizAnswer {
  id               String   @id @default(uuid()) @db.Uuid
  tenantId         String   @db.Uuid
  attemptId        String   @db.Uuid
  questionId       String   @db.Uuid
  selectedOptionId String?  @db.Uuid
  isCorrect        Boolean?
  createdAt        DateTime @default(now())

  tenant           Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  attempt          QuizAttempt  @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  question         QuizQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)
  selectedOption   QuizOption?  @relation(fields: [selectedOptionId], references: [id], onDelete: SetNull)

  @@index([tenantId])
}

// ─── Notifications ────────────────────────────────────────────────────────────
model Notification {
  id        String   @id @default(uuid()) @db.Uuid
  tenantId  String   @db.Uuid
  userId    String   @db.Uuid
  type      String
  title     String
  message   String   @db.Text
  link      String?  @db.Text
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([userId])
}

// ─── Gamification extensions ──────────────────────────────────────────────────
model Badge {
  id             String   @id @default(uuid()) @db.Uuid
  tenantId       String   @db.Uuid
  name           String
  description    String?  @db.Text
  iconUrl        String?  @db.Text
  condition      String
  conditionValue Int
  createdAt      DateTime @default(now())

  tenant         Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  userBadges     UserBadge[]
  badgeTrails    BadgeTrail[]

  @@index([tenantId])
}

model UserBadge {
  id        String   @id @default(uuid()) @db.Uuid
  tenantId  String   @db.Uuid
  userId    String   @db.Uuid
  badgeId   String   @db.Uuid
  earnedAt  DateTime @default(now())

  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  badge     Badge    @relation(fields: [badgeId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([userId])
}

model BadgeTrail {
  id        String   @id @default(uuid()) @db.Uuid
  tenantId  String   @db.Uuid
  badgeId   String   @db.Uuid
  trailId   String   @db.Uuid
  createdAt DateTime @default(now())

  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  badge     Badge    @relation(fields: [badgeId], references: [id], onDelete: Cascade)
  trail     Trail    @relation(fields: [trailId], references: [id], onDelete: Cascade)

  @@index([tenantId])
}

// ─── Competencies & Skills ────────────────────────────────────────────────────
model Competency {
  id          String   @id @default(uuid()) @db.Uuid
  tenantId    String   @db.Uuid
  name        String
  description String?  @db.Text
  category    String?
  level       String   @default("basic")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant                 Tenant                   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  userCompetencies       UserCompetency[]
  trailCompetencies      TrailCompetency[]
  userCompetencyInterests UserCompetencyInterest[]

  @@unique([tenantId, name])
  @@index([tenantId])
}

model UserCompetency {
  id               String   @id @default(uuid()) @db.Uuid
  tenantId         String   @db.Uuid
  userId           String   @db.Uuid
  competencyId     String   @db.Uuid
  proficiencyLevel String   @default("basic")
  verifiedAt       DateTime?
  verifiedById     String?  @db.Uuid
  addedAt          DateTime @default(now())

  tenant           Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user             User       @relation("UserCompetencies", fields: [userId], references: [id], onDelete: Cascade)
  verifiedBy       User?      @relation("VerifiedCompetencies", fields: [verifiedById], references: [id], onDelete: SetNull)
  competency       Competency @relation(fields: [competencyId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([userId])
}

model TrailCompetency {
  id           String   @id @default(uuid()) @db.Uuid
  tenantId     String   @db.Uuid
  trailId      String   @db.Uuid
  competencyId String   @db.Uuid
  type         String   @default("developed") // "required", "developed", "suggested"
  createdAt    DateTime @default(now())

  tenant       Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  trail        Trail      @relation(fields: [trailId], references: [id], onDelete: Cascade)
  competency   Competency @relation(fields: [competencyId], references: [id], onDelete: Cascade)

  @@index([tenantId])
}

model UserCompetencyInterest {
  id           String   @id @default(uuid()) @db.Uuid
  tenantId     String   @db.Uuid
  userId       String   @db.Uuid
  competencyId String   @db.Uuid
  targetLevel  String   @default("intermediate")
  addedAt      DateTime @default(now())
  achievedAt   DateTime?

  tenant       Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  competency   Competency @relation(fields: [competencyId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([userId])
}

model TrailModule {
  id          String   @id @default(uuid()) @db.Uuid
  tenantId    String   @db.Uuid
  trailId     String   @db.Uuid
  title       String
  description String?  @db.Text
  order       Int
  isRequired  Boolean  @default(true)
  points      Int      @default(0)
  createdAt   DateTime @default(now())

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  trail       Trail    @relation(fields: [trailId], references: [id], onDelete: Cascade)
  items       TrailItemAdvanced[]

  @@index([tenantId])
  @@index([trailId])
}

// ─── Advanced Trail Items (Dynamic Content) ────────────────────────────────
model TrailItemAdvanced {
  id                 String   @id @default(uuid()) @db.Uuid
  tenantId           String   @db.Uuid
  trailId            String   @db.Uuid
  moduleId           String?  @db.Uuid
  order              Int
  type               String
  title              String
  description        String?  @db.Text
  contentId          String?  @db.Uuid
  videoUrl           String?  @db.Text
  pdfUrl             String?  @db.Text
  imageUrl           String?  @db.Text
  activityType       String?
  activityContent    Json?
  durationMinutes    Int?
  isRequired         Boolean  @default(true)
  prerequisiteItemId String?  @db.Uuid
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  tenant             Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  trail              Trail        @relation(fields: [trailId], references: [id], onDelete: Cascade)
  module             TrailModule? @relation(fields: [moduleId], references: [id], onDelete: SetNull)
  content            Content?     @relation(fields: [contentId], references: [id], onDelete: SetNull)

  @@index([tenantId])
  @@index([trailId])
}

model TrailRecommendation {
  id           String   @id @default(uuid()) @db.Uuid
  tenantId     String   @db.Uuid
  userId       String   @db.Uuid
  trailId      String   @db.Uuid
  reason       String?
  competencyId String?  @db.Uuid
  score        Float    @default(0)
  dismissed    Boolean  @default(false)
  createdAt    DateTime @default(now())
  dismissedAt  DateTime?

  tenant       Tenant      @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user         User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  trail        Trail       @relation(fields: [trailId], references: [id], onDelete: Cascade)
  competency   Competency? @relation(fields: [competencyId], references: [id], onDelete: SetNull)

  @@index([tenantId])
  @@index([userId])
}

model SessionTracking {
  id              String   @id @default(uuid()) @db.Uuid
  tenantId        String   @db.Uuid
  userId          String   @db.Uuid
  contentId       String?  @db.Uuid
  contentType     String
  startTime       DateTime @default(now())
  endTime         DateTime?
  durationSeconds Int      @default(0)
  createdAt       DateTime @default(now())

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([userId])
}

model UserStudyStats {
  id                  String   @id @default(uuid()) @db.Uuid
  tenantId            String   @db.Uuid
  userId              String   @db.Uuid     @unique
  totalMinutesStudied Int      @default(0)
  sessionsCount       Int      @default(0)
  lastStudySession    DateTime?
  updatedAt           DateTime @updatedAt

  tenant              Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([tenantId])
}
`;

// Helper: inject relations
function injectRelation(modelName, newRelations) {
  const startStr = 'model ' + modelName + ' {';
  const startIndex = schema.indexOf(startStr);
  if (startIndex === -1) return;
  
  let nextModelIndex = schema.indexOf('\\nmodel ', startIndex + 1);
  let enumIndex = schema.indexOf('\\nenum ', startIndex + 1);
  let nextStartIndex = -1;
  
  if (nextModelIndex !== -1 && enumIndex !== -1) nextStartIndex = Math.min(nextModelIndex, enumIndex);
  else if (nextModelIndex !== -1) nextStartIndex = nextModelIndex;
  else if (enumIndex !== -1) nextStartIndex = enumIndex;
  
  const modelTextChunk = nextStartIndex === -1 ? schema.substring(startIndex) : schema.substring(startIndex, nextStartIndex);
  const closingBraceIndex = modelTextChunk.lastIndexOf('}');
  
  const modifiedChunk = modelTextChunk.substring(0, closingBraceIndex) + newRelations + "\\n" + modelTextChunk.substring(closingBraceIndex);
  
  if (nextStartIndex === -1) {
    schema = schema.substring(0, startIndex) + modifiedChunk;
  } else {
    schema = schema.substring(0, startIndex) + modifiedChunk + schema.substring(nextStartIndex);
  }
}

// Inject into Tenant
injectRelation('Tenant', `
  contentVersions     ContentVersion[]
  contentViews        ContentView[]
  contentFavorites    ContentFavorite[]
  contentRatings      ContentRating[]
  quizzes             Quiz[]
  quizQuestions       QuizQuestion[]
  quizOptions         QuizOption[]
  quizAttempts        QuizAttempt[]
  quizAnswers         QuizAnswer[]
  notifications       Notification[]
  badges              Badge[]
  userBadges          UserBadge[]
  badgeTrails         BadgeTrail[]
  competencies        Competency[]
  userCompetencies    UserCompetency[]
  trailCompetencies   TrailCompetency[]
  competencyInterests UserCompetencyInterest[]
  trailModules        TrailModule[]
  trailItemsAdvanced  TrailItemAdvanced[]
  trailRecommendations TrailRecommendation[]
  sessionTrackings    SessionTracking[]
  userStudyStats      UserStudyStats[]
`);

// Inject into User
injectRelation('User', `
  contentVersions      ContentVersion[] @relation("UserContentVersions")
  contentViews         ContentView[]
  contentFavorites     ContentFavorite[]
  contentRatings       ContentRating[]
  quizzesCreated       Quiz[]
  quizAttempts         QuizAttempt[]
  notifications        Notification[]
  userBadges           UserBadge[]
  userCompetencies     UserCompetency[] @relation("UserCompetencies")
  verifiedCompetencies UserCompetency[] @relation("VerifiedCompetencies")
  competencyInterests  UserCompetencyInterest[]
  trailRecommendations TrailRecommendation[]
  sessionTrackings     SessionTracking[]
  studyStats           UserStudyStats?
`);

// Inject into Content
injectRelation('Content', `
  versions            ContentVersion[] @relation("ContentVersions")
  views               ContentView[]
  favorites           ContentFavorite[]
  ratings             ContentRating[]
  trailItemsAdvanced  TrailItemAdvanced[]
`);

// Inject into Trail
injectRelation('Trail', `
  badgeTrails         BadgeTrail[]
  competencies        TrailCompetency[]
  modules             TrailModule[]
  itemsAdvanced       TrailItemAdvanced[]
  recommendations     TrailRecommendation[]
`);

// Inject into TrailItem
injectRelation('TrailItem', `
  quizAttempts        QuizAttempt[]
`);

// Append new models
schema += "\\n" + newModels;

fs.writeFileSync(schemaPath, schema, 'utf8');
console.log('Schema updated successfully');
