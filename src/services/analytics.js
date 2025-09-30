// Advanced Analytics Service
class AnalyticsService {
  constructor() {
    this.metrics = {
      productivity: [],
      burnout: [],
      performance: [],
      goals: [],
      timeTracking: []
    };
  }
  // Productivity Scoring Algorithm
  calculateProductivityScore(member) {
    const tasksCompleted = member.tasks?.filter(task => task.status === 'completed').length || 0;
    const totalTasks = member.tasks?.length || 1;
    const completionRate = tasksCompleted / totalTasks;
    const avgTaskTime = this.calculateAverageTaskTime(member);
    const qualityScore = this.calculateQualityScore(member);
    const consistencyScore = this.calculateConsistencyScore(member);
    // Weighted scoring algorithm
    const productivityScore = (
      completionRate * 0.3 +
      (1 / Math.max(avgTaskTime, 1)) * 0.25 +
      qualityScore * 0.25 +
      consistencyScore * 0.2
    ) * 100;
    return Math.min(Math.max(productivityScore, 0), 100);
  }
  // Burnout Risk Assessment
  assessBurnoutRisk(member) {
    const workload = this.calculateWorkload(member);
    const workingHours = this.getWeeklyWorkingHours(member);
    const stressIndicators = this.getStressIndicators(member);
    const taskComplexity = this.calculateTaskComplexity(member);
    // Risk factors
    const overworkRisk = workingHours > 45 ? (workingHours - 45) / 10 : 0;
    const workloadRisk = workload > 1.2 ? (workload - 1.2) * 2 : 0;
    const stressRisk = stressIndicators.length * 0.2;
    const complexityRisk = taskComplexity > 0.8 ? (taskComplexity - 0.8) * 2 : 0;
    const burnoutRisk = Math.min(
      (overworkRisk + workloadRisk + stressRisk + complexityRisk) * 25,
      100
    );
    return {
      risk: burnoutRisk,
      level: this.getBurnoutLevel(burnoutRisk),
      factors: {
        overwork: overworkRisk > 0,
        workload: workloadRisk > 0,
        stress: stressRisk > 0,
        complexity: complexityRisk > 0
      },
      recommendations: this.getBurnoutRecommendations(burnoutRisk)
    };
  }
  // Team Performance Predictions
  predictTeamPerformance(team, timeframe = 30) {
    const historicalData = this.getHistoricalPerformance(team, timeframe * 2);
    const currentTrends = this.analyzeTrends(historicalData);
    const prediction = {
      productivity: this.predictProductivity(currentTrends),
      deliveryDate: this.predictDeliveryDate(team),
      riskFactors: this.identifyRiskFactors(team),
      recommendations: this.getPerformanceRecommendations(currentTrends)
    };
    return prediction;
  }
  // Goal Tracking and OKR Management
  trackGoals(goals) {
    return goals.map(goal => ({
      ...goal,
      progress: this.calculateGoalProgress(goal),
      onTrack: this.isGoalOnTrack(goal),
      projectedCompletion: this.projectGoalCompletion(goal),
      keyResults: goal.keyResults?.map(kr => ({
        ...kr,
        progress: this.calculateKRProgress(kr),
        confidence: this.calculateKRConfidence(kr)
      }))
    }));
  }
  // Time Tracking with Detailed Breakdowns
  analyzeTimeTracking(member, period = 7) {
    const timeData = this.getTimeTrackingData(member, period);
    return {
      totalHours: timeData.reduce((sum, day) => sum + day.hours, 0),
      averageDaily: timeData.reduce((sum, day) => sum + day.hours, 0) / period,
      breakdown: {
        development: this.calculateTimeByCategory(timeData, 'development'),
        meetings: this.calculateTimeByCategory(timeData, 'meetings'),
        planning: this.calculateTimeByCategory(timeData, 'planning'),
        review: this.calculateTimeByCategory(timeData, 'review'),
        other: this.calculateTimeByCategory(timeData, 'other')
      },
      efficiency: this.calculateTimeEfficiency(timeData),
      trends: this.analyzeTimeTrends(timeData)
    };
  }
  // Helper Methods
  calculateAverageTaskTime(member) {
    const completedTasks = member.tasks?.filter(task => 
      task.status === 'completed' && task.completedAt && task.createdAt
    ) || [];
    if (completedTasks.length === 0) return 1;
    const totalTime = completedTasks.reduce((sum, task) => {
      const duration = new Date(task.completedAt) - new Date(task.createdAt);
      return sum + (duration / (1000 * 60 * 60 * 24)); // Convert to days
    }, 0);
    return totalTime / completedTasks.length;
  }
  calculateQualityScore(member) {
    // Mock quality score based on task reviews and feedback
    const reviews = member.reviews || [];
    if (reviews.length === 0) return 0.8; // Default score
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    return avgRating / 5; // Normalize to 0-1
  }
  calculateConsistencyScore(member) {
    const dailyProductivity = this.getDailyProductivity(member);
    if (dailyProductivity.length < 7) return 0.7; // Default for new members
    const mean = dailyProductivity.reduce((sum, val) => sum + val, 0) / dailyProductivity.length;
    const variance = dailyProductivity.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / dailyProductivity.length;
    const standardDeviation = Math.sqrt(variance);
    // Lower standard deviation = higher consistency
    return Math.max(0, 1 - (standardDeviation / mean));
  }
  calculateWorkload(member) {
    const activeTasks = member.tasks?.filter(task => 
      task.status === 'in-progress' || task.status === 'pending'
    ) || [];
    const totalEffort = activeTasks.reduce((sum, task) => sum + (task.effort || 1), 0);
    const capacity = member.capacity || 40; // Default 40 hours per week
    return totalEffort / capacity;
  }
  getWeeklyWorkingHours(member) {
    // Mock implementation - in real app, this would come from time tracking
    return member.weeklyHours || Math.random() * 20 + 35; // 35-55 hours
  }
  getStressIndicators(member) {
    const indicators = [];
    if (this.calculateWorkload(member) > 1.2) indicators.push('high_workload');
    if (this.getWeeklyWorkingHours(member) > 45) indicators.push('overtime');
    if (member.tasks?.some(task => task.priority === 'high' && task.dueDate < new Date())) {
      indicators.push('overdue_critical_tasks');
    }
    return indicators;
  }
  calculateTaskComplexity(member) {
    const tasks = member.tasks || [];
    if (tasks.length === 0) return 0;
    const complexitySum = tasks.reduce((sum, task) => {
      const complexity = task.complexity || 'medium';
      const complexityMap = { low: 0.3, medium: 0.6, high: 1.0 };
      return sum + complexityMap[complexity];
    }, 0);
    return complexitySum / tasks.length;
  }
  getBurnoutLevel(risk) {
    if (risk < 25) return 'low';
    if (risk < 50) return 'moderate';
    if (risk < 75) return 'high';
    return 'critical';
  }
  getBurnoutRecommendations(risk) {
    const recommendations = [];
    if (risk > 50) {
      recommendations.push('Reduce workload by 20%');
      recommendations.push('Schedule regular breaks');
    }
    if (risk > 70) {
      recommendations.push('Consider time off');
      recommendations.push('Delegate tasks to team members');
    }
    if (risk > 85) {
      recommendations.push('Immediate intervention required');
      recommendations.push('Meet with manager urgently');
    }
    return recommendations;
  }
  // Mock data generators for demonstration
  getHistoricalPerformance(team, days) {
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      productivity: Math.random() * 40 + 60,
      tasksCompleted: Math.floor(Math.random() * 10) + 5,
      quality: Math.random() * 30 + 70
    }));
  }
  analyzeTrends(data) {
    const recent = data.slice(0, 7);
    const previous = data.slice(7, 14);
    const recentAvg = recent.reduce((sum, d) => sum + d.productivity, 0) / recent.length;
    const previousAvg = previous.reduce((sum, d) => sum + d.productivity, 0) / previous.length;
    return {
      trend: recentAvg > previousAvg ? 'improving' : 'declining',
      change: ((recentAvg - previousAvg) / previousAvg) * 100,
      productivity: recentAvg,
      quality: recent.reduce((sum, d) => sum + d.quality, 0) / recent.length
    };
  }
  predictProductivity(trends) {
    const baseProductivity = trends.productivity;
    const trendMultiplier = trends.trend === 'improving' ? 1.1 : 0.9;
    return Math.min(Math.max(baseProductivity * trendMultiplier, 0), 100);
  }
  predictDeliveryDate(team) {
    const avgVelocity = team.reduce((sum, member) => {
      const completedTasks = member.tasks?.filter(t => t.status === 'completed').length || 0;
      return sum + completedTasks;
    }, 0) / team.length;
    const remainingTasks = team.reduce((sum, member) => {
      const pending = member.tasks?.filter(t => t.status !== 'completed').length || 0;
      return sum + pending;
    }, 0);
    const daysToComplete = Math.ceil(remainingTasks / Math.max(avgVelocity, 1));
    return new Date(Date.now() + daysToComplete * 24 * 60 * 60 * 1000);
  }
  identifyRiskFactors(team) {
    const risks = [];
    team.forEach(member => {
      const burnout = this.assessBurnoutRisk(member);
      if (burnout.risk > 60) {
        risks.push(`${member.name} at high burnout risk`);
      }
      if (this.calculateWorkload(member) > 1.5) {
        risks.push(`${member.name} overloaded`);
      }
    });
    return risks;
  }
  getPerformanceRecommendations(trends) {
    const recommendations = [];
    if (trends.trend === 'declining') {
      recommendations.push('Review team workload distribution');
      recommendations.push('Identify and address blockers');
    }
    if (trends.quality < 80) {
      recommendations.push('Implement code review process');
      recommendations.push('Provide additional training');
    }
    return recommendations;
  }
  // Additional helper methods would be implemented here...
  calculateGoalProgress(goal) {
    // Mock implementation
    return Math.random() * 100;
  }
  isGoalOnTrack(goal) {
    const progress = this.calculateGoalProgress(goal);
    const timeElapsed = (new Date() - new Date(goal.startDate)) / (new Date(goal.endDate) - new Date(goal.startDate));
    return progress >= timeElapsed * 100 * 0.8; // 80% of expected progress
  }
  projectGoalCompletion(goal) {
    const progress = this.calculateGoalProgress(goal);
    const timeElapsed = (new Date() - new Date(goal.startDate)) / (new Date(goal.endDate) - new Date(goal.startDate));
    const projectedDays = (100 - progress) / (progress / timeElapsed) * (new Date(goal.endDate) - new Date(goal.startDate)) / (1000 * 60 * 60 * 24);
    return new Date(Date.now() + projectedDays * 24 * 60 * 60 * 1000);
  }
  calculateKRProgress(keyResult) {
    return Math.random() * 100;
  }
  calculateKRConfidence(keyResult) {
    return Math.random() * 100;
  }
  getTimeTrackingData(member, days) {
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      hours: Math.random() * 4 + 6, // 6-10 hours per day
      categories: {
        development: Math.random() * 0.6 + 0.2,
        meetings: Math.random() * 0.3 + 0.1,
        planning: Math.random() * 0.2 + 0.05,
        review: Math.random() * 0.2 + 0.05,
        other: Math.random() * 0.1 + 0.05
      }
    }));
  }
  calculateTimeByCategory(timeData, category) {
    return timeData.reduce((sum, day) => {
      return sum + (day.hours * (day.categories[category] || 0));
    }, 0);
  }
  calculateTimeEfficiency(timeData) {
    const productiveCategories = ['development', 'planning', 'review'];
    const totalHours = timeData.reduce((sum, day) => sum + day.hours, 0);
    const productiveHours = timeData.reduce((sum, day) => {
      const productive = productiveCategories.reduce((pSum, cat) => {
        return pSum + (day.hours * (day.categories[cat] || 0));
      }, 0);
      return sum + productive;
    }, 0);
    return totalHours > 0 ? (productiveHours / totalHours) * 100 : 0;
  }
  analyzeTimeTrends(timeData) {
    const recent = timeData.slice(0, 3);
    const previous = timeData.slice(3, 6);
    const recentAvg = recent.reduce((sum, day) => sum + day.hours, 0) / recent.length;
    const previousAvg = previous.reduce((sum, day) => sum + day.hours, 0) / previous.length;
    return {
      trend: recentAvg > previousAvg ? 'increasing' : 'decreasing',
      change: recentAvg - previousAvg,
      average: recentAvg
    };
  }
  getDailyProductivity(member) {
    // Mock daily productivity scores for the last 14 days
    return Array.from({ length: 14 }, () => Math.random() * 40 + 60);
  }
}
export default new AnalyticsService();
