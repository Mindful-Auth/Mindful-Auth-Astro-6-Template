/// <reference types="astro/client" />
import type { MindfulAuthLocals } from '@mindfulauth/core';

// Astro.locals type definitions
// Extend this interface with your own custom locals below
declare namespace App {
    interface Locals extends MindfulAuthLocals {
        // ADD YOUR CUSTOM LOCALS HERE
        // Example: userId?: string;
    }
}