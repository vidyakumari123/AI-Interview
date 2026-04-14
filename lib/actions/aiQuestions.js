"use server";

import { currentUser } from "@clerk/nextjs/server";

const CATEGORY_QUESTIONS = {
    FRONTEND: [
        {
            question: "How do you optimize a React application for performance?",
            answer:
                "Identify slow render paths, memoize components and values, avoid unnecessary updates, and use code splitting for large bundles.",
        },
        {
            question: "What is the difference between relative and absolute units in CSS?",
            answer:
                "Relative units scale with the parent or root font size, while absolute units are fixed, making relative units better for responsive layouts.",
        },
        {
            question: "How do you handle browser compatibility for modern JavaScript features?",
            answer:
                "Use feature detection, polyfills, and transpilation tools like Babel to ensure consistent behavior across browsers.",
        },
        {
            question: "Explain the purpose of useEffect in React and a common pitfall.",
            answer:
                "useEffect handles side effects after render; a common pitfall is missing dependencies, which can cause stale or repeated effects.",
        },
        {
            question: "How do you make a component accessible to keyboard users?",
            answer:
                "Ensure interactive elements can receive focus, provide clear labels, and support standard keyboard controls.",
        },
        {
            question: "What is event delegation and why is it useful?",
            answer:
                "Event delegation uses a single parent listener for child events, which simplifies code and improves performance.",
        },
    ],
    BACKEND: [
        {
            question: "How do you design a REST API endpoint to support pagination?",
            answer:
                "Use query parameters like page and limit or cursor tokens, and return metadata so clients can navigate pages.",
        },
        {
            question: "What strategies do you use to secure API endpoints?",
            answer:
                "Enforce authentication and authorization, validate input, use HTTPS, and add rate limiting.",
        },
        {
            question: "How do you choose between SQL and NoSQL databases?",
            answer:
                "Choose SQL for structured relational data and strong consistency, and NoSQL for flexible schemas and horizontal scaling.",
        },
        {
            question: "What is caching and why is it useful?",
            answer:
                "Caching stores frequent data closer to clients, reducing backend load and improving response time.",
        },
        {
            question: "Explain idempotency in HTTP methods.",
            answer:
                "Idempotent methods can be repeated without changing the result after the initial request, simplifying retries.",
        },
        {
            question: "How do you handle database migrations in production?",
            answer:
                "Use versioned migration scripts, test in staging, and deploy changes carefully with rollback plans.",
        },
    ],
    FULLSTACK: [
        {
            question: "How do you coordinate frontend and backend development?",
            answer:
                "Define clear API contracts, use shared documentation, and keep communication frequent.",
        },
        {
            question: "What are the benefits of server-side rendering?",
            answer:
                "SSR improves initial load performance and SEO by delivering pre-rendered HTML.",
        },
        {
            question: "How do you structure state in a full-stack app?",
            answer:
                "Keep UI state on the client, shared business logic on the server, and avoid duplicating domain rules.",
        },
        {
            question: "How do you validate input on both client and server?",
            answer:
                "Validate on the client for UX, but enforce validation on the server for security and data integrity.",
        },
        {
            question: "What is the role of APIs in microservices?",
            answer:
                "APIs define service contracts and enable independent services to communicate reliably.",
        },
        {
            question: "How do you deploy a full-stack app safely?",
            answer:
                "Use CI/CD, feature flags, and staged rollouts to reduce risk.",
        },
    ],
    DSA: [
        {
            question: "How do you choose the right data structure for a problem?",
            answer:
                "Consider the operations you need, performance requirements, and memory usage.",
        },
        {
            question: "What is the difference between a stack and a queue?",
            answer:
                "A stack is LIFO and a queue is FIFO, each useful for different access patterns.",
        },
        {
            question: "How does quicksort work and what is its average complexity?",
            answer:
                "Quicksort partitions around a pivot and recursively sorts subarrays, with average time O(n log n).",
        },
        {
            question: "What is dynamic programming?",
            answer:
                "Dynamic programming caches solutions to overlapping subproblems to avoid repeated work.",
        },
        {
            question: "How do hash tables handle collisions?",
            answer:
                "They use chaining or open addressing to store multiple items in the same bucket.",
        },
        {
            question: "What is the difference between DFS and BFS?",
            answer:
                "DFS explores deep branches first, while BFS visits nodes level by level.",
        },
    ],
    SYSTEM_DESIGN: [
        {
            question: "How do you design a system for file uploads?",
            answer:
                "Use direct storage uploads, shard metadata, and ensure retry and validation handling.",
        },
        {
            question: "What is a load balancer for?",
            answer:
                "It distributes traffic across servers to improve performance and availability.",
        },
        {
            question: "How do you ensure high availability?",
            answer:
                "Use redundancy, failover, and health checks to avoid single points of failure.",
        },
        {
            question: "Why is caching important in system design?",
            answer:
                "Caching reduces latency and backend load by storing frequently used data closer to the consumer.",
        },
        {
            question: "How would you design real-time messaging?",
            answer:
                "Use event-driven architecture, message brokers, and partitioning for low-latency delivery.",
        },
        {
            question: "What is the consistency-availability tradeoff?",
            answer:
                "Strong consistency can reduce availability during partitions, while eventual consistency favors uptime.",
        },
    ],
    BEHAVIORAL: [
        {
            question: "How do you handle conflict on a team?",
            answer:
                "Listen actively, communicate respectfully, and find a solution that aligns with shared goals.",
        },
        {
            question: "Describe a mistake you learned from.",
            answer:
                "Be honest about the error, explain how you fixed it, and describe the change you made.",
        },
        {
            question: "How do you prioritize tasks under pressure?",
            answer:
                "Focus on high-impact work, communicate timelines, and break tasks into smaller steps.",
        },
        {
            question: "What do you do when you disagree with a manager?",
            answer:
                "Share your viewpoint professionally and work toward mutual understanding.",
        },
        {
            question: "How do you promote inclusion in a team?",
            answer:
                "Encourage diverse voices and create a safe space for everyone to contribute.",
        },
        {
            question: "What motivates you at work?",
            answer:
                "I’m motivated by solving hard problems, learning continuously, and making an impact.",
        },
    ],
    DEVOPS: [
        {
            question: "What is infrastructure as code?",
            answer:
                "IaC automates provisioning and makes environments reproducible and version-controlled.",
        },
        {
            question: "How do you monitor production systems?",
            answer:
                "Use metrics, logs, and alerts to detect and respond to issues quickly.",
        },
        {
            question: "What are the benefits of containers?",
            answer:
                "Containers package apps consistently and simplify deployment across environments.",
        },
        {
            question: "How do you design CI/CD?",
            answer:
                "Automate tests, builds, and deployments so changes are validated and released reliably.",
        },
        {
            question: "What is the difference between continuous delivery and deployment?",
            answer:
                "Delivery prepares every change, while deployment automatically releases passing changes.",
        },
        {
            question: "How do you secure cloud infrastructure?",
            answer:
                "Use strong access controls, encryption, monitoring, and audits.",
        },
    ],
    MOBILE: [
        {
            question: "How do you optimize mobile performance?",
            answer:
                "Minimize rendering cost, reduce network requests, and cache data effectively.",
        },
        {
            question: "What challenges come with offline support?",
            answer:
                "Handle sync conflicts, stale data, and provide clear offline UX.",
        },
        {
            question: "How do you design responsive mobile layouts?",
            answer:
                "Use flexible components and adapt layouts to different screen sizes.",
        },
        {
            question: "What is the difference between native and cross-platform development?",
            answer:
                "Native apps offer deeper platform integration while cross-platform shares code across platforms.",
        },
        {
            question: "How do you ensure mobile accessibility?",
            answer:
                "Support screen readers, large touch targets, and clear labels.",
        },
        {
            question: "Why is battery efficiency important?",
            answer:
                "Efficient apps use fewer resources and improve user retention.",
        },
    ],
};

export const generateInterviewQuestions = async ({ category }) => {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    if (!category || !CATEGORY_QUESTIONS[category])
        throw new Error("Invalid category");

    return {
        questions: CATEGORY_QUESTIONS[category],
    };
};