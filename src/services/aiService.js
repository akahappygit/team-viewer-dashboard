class AIService {
  constructor() {
    this.taskPatterns = new Map();
    this.workloadHistory = new Map();
    this.performanceMetrics = new Map();
    this.learningData = {
      taskCompletionTimes: {},
      memberSkills: {},
      collaborationPatterns: {},
      productivityTrends: {}
    };
  }
  generateTaskSuggestions(members, tasks, currentUser) {
    const suggestions = [];
    // Analyze current workload distribution
    const workloadAnalysis = this.analyzeWorkloadDistribution(members, tasks);
    // Generate suggestions based on different criteria
    suggestions.push(...this.suggestTaskReassignments(workloadAnalysis));
    suggestions.push(...this.suggestNewTasks(members, tasks));
    suggestions.push(...this.suggestOptimizations(members, tasks));
    suggestions.push(...this.suggestCollaborations(members, tasks));
    return suggestions.sort((a, b) => b.priority - a.priority).slice(0, 10);
  }
  balanceWorkload(members, tasks) {
    const analysis = this.analyzeWorkloadDistribution(members, tasks);
    const recommendations = [];
    // Identify overloaded and underutilized members
    const overloaded = analysis.members.filter(m => m.workloadScore > 0.8);
    const underutilized = analysis.members.filter(m => m.workloadScore < 0.4);
    overloaded.forEach(member => {
      const tasksToReassign = this.identifyTasksForReassignment(member, tasks);
      tasksToReassign.forEach(task => {
        const bestCandidate = this.findBestReassignmentCandidate(task, underutilized, members);
        if (bestCandidate) {
          recommendations.push({
            type: 'reassignment',
            task: task,
            from: member,
            to: bestCandidate,
            reason: `Balance workload - ${member.name} is overloaded (${Math.round(member.workloadScore * 100)}%)`,
            impact: this.calculateReassignmentImpact(task, member, bestCandidate),
            priority: 0.8
          });
        }
      });
    });
    return recommendations;
  }
  predictTaskCompletion(task, assignee, historicalData = []) {
    const baseEstimate = task.estimatedHours || 8;
    // Factors affecting completion time
    const complexityMultiplier = this.getComplexityMultiplier(task);
    const skillMultiplier = this.getSkillMultiplier(assignee, task);
    const workloadMultiplier = this.getWorkloadMultiplier(assignee);
    // Historical performance adjustment
    const performanceMultiplier = this.getPerformanceMultiplier(assignee, historicalData);
    const predictedHours = baseEstimate * complexityMultiplier * skillMultiplier * workloadMultiplier * performanceMultiplier;
    // Calculate confidence level
    const confidence = this.calculatePredictionConfidence(assignee, task, historicalData);
    return {
      estimatedHours: Math.round(predictedHours * 10) / 10,
      confidence: confidence,
      factors: {
        complexity: complexityMultiplier,
        skill: skillMultiplier,
        workload: workloadMultiplier,
        performance: performanceMultiplier
      },
      completionDate: this.calculateCompletionDate(predictedHours, assignee)
    };
  }
  generateAutoAssignments(tasks, members) {
    const assignments = [];
    const unassignedTasks = tasks.filter(task => !task.assignedTo);
    unassignedTasks.forEach(task => {
      const bestAssignee = this.findOptimalAssignee(task, members);
      if (bestAssignee) {
        assignments.push({
          task: task,
          assignee: bestAssignee,
          confidence: bestAssignee.matchScore,
          reasoning: bestAssignee.reasoning,
          estimatedCompletion: this.predictTaskCompletion(task, bestAssignee.member)
        });
      }
    });
    return assignments.sort((a, b) => b.confidence - a.confidence);
  }
  analyzeProductivityPatterns(members, tasks, timeframe = 30) {
    const patterns = {
      peakHours: this.identifyPeakProductivityHours(members, tasks),
      collaborationEfficiency: this.analyzeCollaborationEfficiency(members, tasks),
      bottlenecks: this.identifyBottlenecks(tasks),
      skillGaps: this.identifySkillGaps(members, tasks),
      burnoutRisk: this.assessBurnoutRisk(members)
    };
    const suggestions = this.generateProductivitySuggestions(patterns);
    return {
      patterns,
      suggestions,
      insights: this.generateInsights(patterns)
    };
  }
  generateSmartNotifications(user, context) {
    const notifications = [];
    // Task deadline notifications
    notifications.push(...this.generateDeadlineNotifications(user, context));
    // Workload balance notifications
    notifications.push(...this.generateWorkloadNotifications(user, context));
    // Collaboration opportunities
    notifications.push(...this.generateCollaborationNotifications(user, context));
    // Performance insights
    notifications.push(...this.generatePerformanceNotifications(user, context));
    return notifications
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5);
  }
  // Helper methods for AI algorithms
  analyzeWorkloadDistribution(members, tasks) {
    const memberWorkloads = members.map(member => {
      const memberTasks = tasks.filter(task => task.assignedTo === member.id);
      const totalHours = memberTasks.reduce((sum, task) => sum + (task.estimatedHours || 8), 0);
      const completedHours = memberTasks
        .filter(task => task.status === 'completed')
        .reduce((sum, task) => sum + (task.actualHours || task.estimatedHours || 8), 0);
      return {
        ...member,
        totalTasks: memberTasks.length,
        totalHours,
        completedHours,
        workloadScore: Math.min(totalHours / 40, 1), // Assuming 40 hours per week capacity
        efficiency: completedHours > 0 ? completedHours / totalHours : 0
      };
    });
    return {
      members: memberWorkloads,
      averageWorkload: memberWorkloads.reduce((sum, m) => sum + m.workloadScore, 0) / memberWorkloads.length,
      workloadVariance: this.calculateVariance(memberWorkloads.map(m => m.workloadScore))
    };
  }
  suggestTaskReassignments(workloadAnalysis) {
    const suggestions = [];
    const threshold = 0.2; // 20% difference threshold
    workloadAnalysis.members.forEach(member => {
      if (member.workloadScore > workloadAnalysis.averageWorkload + threshold) {
        suggestions.push({
          type: 'workload_balance',
          title: `Redistribute tasks for ${member.name}`,
          description: `${member.name} has ${Math.round(member.workloadScore * 100)}% workload capacity. Consider redistributing some tasks.`,
          action: 'reassign_tasks',
          target: member,
          priority: 0.8,
          impact: 'high'
        });
      }
    });
    return suggestions;
  }
  suggestNewTasks(members, tasks) {
    const suggestions = [];
    // Suggest tasks based on skill development
    members.forEach(member => {
      const skillGaps = this.identifyMemberSkillGaps(member, tasks);
      skillGaps.forEach(skill => {
        suggestions.push({
          type: 'skill_development',
          title: `Skill development opportunity for ${member.name}`,
          description: `Consider assigning ${skill} related tasks to ${member.name} for skill development.`,
          action: 'create_learning_task',
          target: member,
          skill: skill,
          priority: 0.6,
          impact: 'medium'
        });
      });
    });
    return suggestions;
  }
  suggestOptimizations(members, tasks) {
    const suggestions = [];
    // Suggest process optimizations
    const bottlenecks = this.identifyBottlenecks(tasks);
    bottlenecks.forEach(bottleneck => {
      suggestions.push({
        type: 'process_optimization',
        title: 'Process bottleneck detected',
        description: `${bottleneck.stage} is causing delays. Consider process optimization.`,
        action: 'optimize_process',
        target: bottleneck,
        priority: 0.7,
        impact: 'high'
      });
    });
    return suggestions;
  }
  suggestCollaborations(members, tasks) {
    const suggestions = [];
    // Suggest collaboration opportunities
    const collaborationOpportunities = this.identifyCollaborationOpportunities(members, tasks);
    collaborationOpportunities.forEach(opportunity => {
      suggestions.push({
        type: 'collaboration',
        title: 'Collaboration opportunity',
        description: `${opportunity.members.join(' and ')} could collaborate on ${opportunity.area} tasks.`,
        action: 'create_collaboration',
        target: opportunity,
        priority: 0.5,
        impact: 'medium'
      });
    });
    return suggestions;
  }
  findOptimalAssignee(task, members) {
    const candidates = members.map(member => {
      const skillMatch = this.calculateSkillMatch(member, task);
      const workloadScore = this.calculateCurrentWorkload(member);
      const availabilityScore = this.calculateAvailability(member);
      const matchScore = (skillMatch * 0.4) + ((1 - workloadScore) * 0.3) + (availabilityScore * 0.3);
      return {
        member,
        matchScore,
        reasoning: this.generateAssignmentReasoning(member, task, skillMatch, workloadScore, availabilityScore)
      };
    });
    return candidates.sort((a, b) => b.matchScore - a.matchScore)[0];
  }
  calculateSkillMatch(member, task) {
    const requiredSkills = task.requiredSkills || [];
    const memberSkills = member.skills || [];
    if (requiredSkills.length === 0) return 0.5; // Neutral if no specific skills required
    const matchingSkills = requiredSkills.filter(skill => 
      memberSkills.some(memberSkill => memberSkill.name === skill)
    );
    return matchingSkills.length / requiredSkills.length;
  }
  calculateCurrentWorkload(member) {
    // Mock calculation - in real implementation, this would analyze current tasks
    return Math.random() * 0.8; // 0-80% workload
  }
  calculateAvailability(member) {
    // Mock calculation - in real implementation, this would check calendar/schedule
    return member.status === 'working' ? 0.8 : 0.3;
  }
  generateAssignmentReasoning(member, task, skillMatch, workloadScore, availabilityScore) {
    const reasons = [];
    if (skillMatch > 0.7) reasons.push('Strong skill match');
    if (workloadScore < 0.5) reasons.push('Available capacity');
    if (availabilityScore > 0.7) reasons.push('Currently available');
    if (member.performance?.rating > 4) reasons.push('High performer');
    return reasons.join(', ') || 'General availability';
  }
  // Additional helper methods
  getComplexityMultiplier(task) {
    const complexity = task.complexity || 'medium';
    const multipliers = { low: 0.8, medium: 1.0, high: 1.5, critical: 2.0 };
    return multipliers[complexity] || 1.0;
  }
  getSkillMultiplier(assignee, task) {
    const skillMatch = this.calculateSkillMatch(assignee, task);
    return 1.2 - (skillMatch * 0.4); // Higher skill = faster completion
  }
  getWorkloadMultiplier(assignee) {
    const workload = this.calculateCurrentWorkload(assignee);
    return 1 + (workload * 0.5); // Higher workload = slower completion
  }
  getPerformanceMultiplier(assignee, historicalData) {
    // Mock performance calculation
    const performance = assignee.performance?.efficiency || 1.0;
    return 2 - performance; // Higher performance = faster completion
  }
  calculatePredictionConfidence(assignee, task, historicalData) {
    // Mock confidence calculation
    const dataPoints = historicalData.length;
    const baseConfidence = Math.min(dataPoints / 10, 0.8);
    const skillConfidence = this.calculateSkillMatch(assignee, task) * 0.2;
    return Math.min(baseConfidence + skillConfidence, 0.95);
  }
  calculateCompletionDate(estimatedHours, assignee) {
    const hoursPerDay = 6; // Assuming 6 productive hours per day
    const daysNeeded = Math.ceil(estimatedHours / hoursPerDay);
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + daysNeeded);
    return completionDate;
  }
  identifyBottlenecks(tasks) {
    // Mock bottleneck identification
    return [
      { stage: 'Code Review', delay: 2.5, impact: 'high' },
      { stage: 'Testing', delay: 1.8, impact: 'medium' }
    ];
  }
  identifySkillGaps(members, tasks) {
    // Mock skill gap analysis
    return {
      teamGaps: ['React Native', 'DevOps', 'UI/UX Design'],
      individualGaps: members.map(member => ({
        member: member.name,
        gaps: ['Advanced JavaScript', 'System Design']
      }))
    };
  }
  calculateVariance(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }
  // Mock methods for demonstration
  identifyPeakProductivityHours() {
    return { start: 9, end: 11, efficiency: 0.85 };
  }
  analyzeCollaborationEfficiency() {
    return { score: 0.75, improvements: ['Better communication tools', 'Regular sync meetings'] };
  }
  assessBurnoutRisk(members) {
    return members.map(member => ({
      member: member.name,
      risk: Math.random() * 0.6, // 0-60% risk
      factors: ['High workload', 'Long hours']
    }));
  }
  generateProductivitySuggestions(patterns) {
    return [
      'Schedule important tasks during peak hours (9-11 AM)',
      'Implement pair programming for complex tasks',
      'Add automated testing to reduce bottlenecks',
      'Provide training for identified skill gaps'
    ];
  }
  generateInsights(patterns) {
    return [
      `Team is most productive between ${patterns.peakHours.start}-${patterns.peakHours.end} AM`,
      `Collaboration efficiency is at ${Math.round(patterns.collaborationEfficiency.score * 100)}%`,
      `${patterns.bottlenecks.length} process bottlenecks identified`,
      `${patterns.skillGaps.teamGaps.length} skill gaps need attention`
    ];
  }
  generateDeadlineNotifications(user, context) {
    return [
      {
        type: 'deadline',
        title: 'Task deadline approaching',
        message: 'Project Alpha due in 2 days',
        priority: 0.9,
        action: 'view_task'
      }
    ];
  }
  generateWorkloadNotifications(user, context) {
    return [
      {
        type: 'workload',
        title: 'Workload optimization available',
        message: 'You can redistribute 2 tasks to balance team workload',
        priority: 0.6,
        action: 'balance_workload'
      }
    ];
  }
  generateCollaborationNotifications(user, context) {
    return [
      {
        type: 'collaboration',
        title: 'Collaboration opportunity',
        message: 'John and Sarah could collaborate on the API integration',
        priority: 0.5,
        action: 'suggest_collaboration'
      }
    ];
  }
  generatePerformanceNotifications(user, context) {
    return [
      {
        type: 'performance',
        title: 'Performance insight',
        message: 'Team productivity increased 15% this week',
        priority: 0.4,
        action: 'view_analytics'
      }
    ];
  }
  identifyMemberSkillGaps(member, tasks) {
    // Mock skill gap identification for individual member
    return ['Advanced React', 'TypeScript'];
  }
  identifyCollaborationOpportunities(members, tasks) {
    // Mock collaboration opportunity identification
    return [
      {
        members: ['John Doe', 'Sarah Wilson'],
        area: 'Frontend Development',
        potential: 0.8
      }
    ];
  }
  identifyTasksForReassignment(member, tasks) {
    // Mock task identification for reassignment
    return tasks
      .filter(task => task.assignedTo === member.id)
      .filter(task => task.status === 'pending')
      .slice(0, 2); // Return up to 2 tasks for reassignment
  }
  findBestReassignmentCandidate(task, underutilizedMembers, allMembers) {
    if (underutilizedMembers.length === 0) return null;
    return underutilizedMembers.reduce((best, current) => {
      const currentSkillMatch = this.calculateSkillMatch(current, task);
      const bestSkillMatch = best ? this.calculateSkillMatch(best, task) : 0;
      return currentSkillMatch > bestSkillMatch ? current : best;
    }, null);
  }
  calculateReassignmentImpact(task, fromMember, toMember) {
    return {
      workloadReduction: 0.15, // 15% workload reduction for fromMember
      skillDevelopment: 0.1,   // 10% skill development for toMember
      teamBalance: 0.2         // 20% improvement in team balance
    };
  }
}
export default new AIService();
