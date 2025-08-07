"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code2, ArrowLeft, Bug, Trophy, Zap, Calendar, User, MousePointer, CheckCircle, Clock, Target, Flame, Github, Star, Award, TrendingUp, Users } from 'lucide-react'

const userStats = {
  username: 'codecrafter',
  name: 'Code Crafter',
  avatar: '/github-avatar.png',
  joinDate: 'October 2024',
  totalBugsFixed: 47,
  currentStreak: 12,
  longestStreak: 23,
  rank: 3,
  totalUsers: 1247,
  level: 'Debug Master',
  xp: 2840,
  nextLevelXp: 3000,
  completedTools: 15,
  totalTools: 18,
  favoriteLanguage: 'JavaScript',
  timeSpent: '24h 32m'
}

const completedTools = [
  {
    id: 'date-calculator',
    name: 'Date Calculator',
    icon: Calendar,
    bugsFixed: 2,
    totalBugs: 2,
    timeSpent: '12m',
    completedAt: '2 days ago',
    difficulty: 'S-0',
    xpEarned: 150
  },
  {
    id: 'bio-generator',
    name: 'Bio Generator',
    icon: User,
    bugsFixed: 1,
    totalBugs: 1,
    timeSpent: '8m',
    completedAt: '1 day ago',
    difficulty: 'S-0',
    xpEarned: 100
  },
  {
    id: 'click-counter',
    name: 'Click Counter',
    icon: MousePointer,
    bugsFixed: 1,
    totalBugs: 1,
    timeSpent: '15m',
    completedAt: '6 hours ago',
    difficulty: 'S-0',
    xpEarned: 120
  }
]

const leaderboardData = [
  {
    rank: 1,
    username: 'debugqueen',
    name: 'Sarah Chen',
    avatar: '/developer-avatar-1.png',
    bugsFixed: 89,
    streak: 28,
    level: 'Bug Slayer',
    xp: 4250,
    badge: 'crown'
  },
  {
    rank: 2,
    username: 'fixmaster',
    name: 'Alex Rivera',
    avatar: '/developer-avatar-2.png',
    bugsFixed: 67,
    streak: 15,
    level: 'Code Surgeon',
    xp: 3890,
    badge: 'star'
  },
  {
    rank: 3,
    username: 'codecrafter',
    name: 'Code Crafter',
    avatar: '/github-avatar.png',
    bugsFixed: 47,
    streak: 12,
    level: 'Debug Master',
    xp: 2840,
    badge: 'medal',
    isCurrentUser: true
  },
  {
    rank: 4,
    username: 'syntaxninja',
    name: 'Jordan Kim',
    avatar: '/developer-avatar-3.png',
    bugsFixed: 43,
    streak: 8,
    level: 'Bug Hunter',
    xp: 2650,
    badge: null
  },
  {
    rank: 5,
    username: 'errorslayer',
    name: 'Morgan Taylor',
    avatar: '/developer-avatar-4.png',
    bugsFixed: 38,
    streak: 19,
    level: 'Debug Specialist',
    xp: 2340,
    badge: null
  }
]

const achievements = [
  {
    id: 'first-bug',
    name: 'First Fix',
    description: 'Squashed your first bug',
    icon: Bug,
    earned: true,
    earnedAt: '3 days ago'
  },
  {
    id: 'speed-demon',
    name: 'Speed Run',
    description: 'Fixed a bug in under 5 minutes',
    icon: Zap,
    earned: true,
    earnedAt: '2 days ago'
  },
  {
    id: 'streak-master',
    name: 'On Fire',
    description: 'Hit a 10-day streak',
    icon: Flame,
    earned: true,
    earnedAt: '1 day ago'
  },
  {
    id: 'perfectionist',
    name: 'Clean Sweep',
    description: 'Ship a tool with zero bugs',
    icon: Target,
    earned: false,
    progress: 85
  }
]

interface ProfilePageProps {
  onBack: () => void
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="h-4 w-4 text-[#FEC260]" />
    if (rank === 2) return <Award className="h-4 w-4 text-gray-400" />
    if (rank === 3) return <Star className="h-4 w-4 text-[#CD7F32]" />
    return null
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <div className="border-b border-[#1E1E1E] px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white hover:bg-[#1E1E1E] text-xs sm:text-sm"
            size="sm"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Studio</span><span className="sm:hidden">Back</span>
          </Button>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Code2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#7EE787]" />
            <span className="text-base sm:text-lg font-bold">/build</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#1E1E1E] border-[#1E1E1E] text-sm sm:text-base">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-[#7EE787] data-[state=active]:text-black"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard"
              className="data-[state=active]:bg-[#7EE787] data-[state=active]:text-black"
            >
              Leaderboard
            </TabsTrigger>
            <TabsTrigger 
              value="achievements"
              className="data-[state=active]:bg-[#7EE787] data-[state=active]:text-black"
            >
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            {/* Profile Header */}
            <Card className="bg-[#1E1E1E] border-[#1E1E1E] p-8 mb-8">
              <div className="flex items-start gap-6">
                <img 
                  src={userStats.avatar || "/placeholder.svg"} 
                  alt={userStats.username}
                  className="w-20 h-20 rounded-full border-2 border-[#7EE787]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{userStats.name}</h1>
                    <Badge className="bg-[#7EE787] text-black">
                      #{userStats.rank}
                    </Badge>
                  </div>
                  <p className="text-gray-400 mb-1">@{userStats.username}</p>
                  <p className="text-sm text-gray-500 mb-4">Joined {userStats.joinDate}</p>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#7EE787]">{userStats.totalBugsFixed}</div>
                      <div className="text-xs text-gray-400">Bugs Fixed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#FEC260]">{userStats.currentStreak}</div>
                      <div className="text-xs text-gray-400">Day Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{userStats.level}</div>
                      <div className="text-xs text-gray-400">Level</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-1">Next level</div>
                    <Progress 
                      value={(userStats.xp / userStats.nextLevelXp) * 100} 
                      className="w-32 h-2"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {userStats.xp} / {userStats.nextLevelXp} XP
                    </div>
                  </div>
                  <Button className="bg-[#7EE787] text-black hover:bg-[#6BD975]">
                    <Github className="h-4 w-4 mr-2" />
                    View GitHub
                  </Button>
                </div>
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-[#1E1E1E] border-[#1E1E1E] p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="h-5 w-5 text-[#7EE787]" />
                  <span className="text-sm text-gray-400">Tools Shipped</span>
                </div>
                <div className="text-2xl font-bold">{userStats.completedTools}/{userStats.totalTools}</div>
                <Progress value={(userStats.completedTools / userStats.totalTools) * 100} className="mt-2 h-1" />
              </Card>

              <Card className="bg-[#1E1E1E] border-[#1E1E1E] p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="h-5 w-5 text-[#FEC260]" />
                  <span className="text-sm text-gray-400">Best Streak</span>
                </div>
                <div className="text-2xl font-bold">{userStats.longestStreak} days</div>
              </Card>

              <Card className="bg-[#1E1E1E] border-[#1E1E1E] p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-white" />
                  <span className="text-sm text-gray-400">Time Spent</span>
                </div>
                <div className="text-2xl font-bold">{userStats.timeSpent}</div>
              </Card>

              <Card className="bg-[#1E1E1E] border-[#1E1E1E] p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-[#7EE787]" />
                  <span className="text-sm text-gray-400">Global Rank</span>
                </div>
                <div className="text-2xl font-bold">#{userStats.rank}</div>
                <div className="text-xs text-gray-500">of {userStats.totalUsers}</div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-[#1E1E1E] border-[#1E1E1E] p-6">
              <h2 className="text-xl font-bold mb-6">Recent Builds</h2>
              <div className="space-y-4">
                {completedTools.map((tool) => {
                  const IconComponent = tool.icon
                  return (
                    <div key={tool.id} className="flex items-center gap-4 p-4 bg-[#121212] rounded-lg">
                      <div className="p-2 bg-[#1E1E1E] rounded-lg">
                        <IconComponent className="h-5 w-5 text-[#7EE787]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{tool.name}</h3>
                          <Badge variant="secondary" className="bg-[#1E1E1E] text-[#FEC260] text-xs">
                            {tool.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{tool.bugsFixed}/{tool.totalBugs} bugs fixed</span>
                          <span>•</span>
                          <span>{tool.timeSpent}</span>
                          <span>•</span>
                          <span>{tool.completedAt}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#7EE787] font-medium">+{tool.xpEarned} XP</div>
                        <CheckCircle className="h-4 w-4 text-[#7EE787] ml-auto mt-1" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-8">
            <Card className="bg-[#1E1E1E] border-[#1E1E1E] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Leaderboard</h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="h-4 w-4" />
                  {userStats.totalUsers} builders
                </div>
              </div>
              
              <div className="space-y-3">
                {leaderboardData.map((user) => (
                  <div 
                    key={user.username} 
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                      user.isCurrentUser 
                        ? 'bg-[#7EE787]/10 border border-[#7EE787]/20' 
                        : 'bg-[#121212] hover:bg-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex items-center gap-2 w-8">
                        <span className={`text-lg font-bold ${
                          user.rank <= 3 ? 'text-[#7EE787]' : 'text-gray-400'
                        }`}>
                          #{user.rank}
                        </span>
                        {getRankBadge(user.rank)}
                      </div>
                      
                      <img 
                        src={user.avatar || "/placeholder.svg"} 
                        alt={user.username}
                        className="w-10 h-10 rounded-full"
                      />
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium truncate">{user.name}</h3>
                          {user.isCurrentUser && (
                            <Badge className="bg-[#7EE787] text-black text-xs">You</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">@{user.username}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-[#7EE787]">{user.bugsFixed}</div>
                        <div className="text-gray-400">Bugs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-[#FEC260]">{user.streak}</div>
                        <div className="text-gray-400">Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{user.xp}</div>
                        <div className="text-gray-400">XP</div>
                      </div>
                    </div>
                    
                    <Badge variant="secondary" className="bg-[#121212] text-gray-300">
                      {user.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="mt-8">
            <Card className="bg-[#1E1E1E] border-[#1E1E1E] p-6">
              <h2 className="text-2xl font-bold mb-6">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => {
                  const IconComponent = achievement.icon
                  return (
                    <div 
                      key={achievement.id}
                      className={`p-6 rounded-lg border transition-all ${
                        achievement.earned 
                          ? 'bg-[#7EE787]/10 border-[#7EE787]/20' 
                          : 'bg-[#121212] border-[#1E1E1E]'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${
                          achievement.earned ? 'bg-[#7EE787] text-black' : 'bg-[#1E1E1E] text-gray-400'
                        }`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold mb-1 ${
                            achievement.earned ? 'text-white' : 'text-gray-400'
                          }`}>
                            {achievement.name}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2">
                            {achievement.description}
                          </p>
                          {achievement.earned ? (
                            <div className="text-xs text-[#7EE787]">
                              Unlocked {achievement.earnedAt}
                            </div>
                          ) : achievement.progress ? (
                            <div>
                              <Progress value={achievement.progress} className="h-1 mb-1" />
                              <div className="text-xs text-gray-500">
                                {achievement.progress}% complete
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500">Locked</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
