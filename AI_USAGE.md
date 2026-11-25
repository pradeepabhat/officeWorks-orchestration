# AI Usage & Development Process

## Tools & Models Used

### **AI Assistant**
- **Model**: Claude (via Copilot SDK in VS Code)
- **Context**: Copilot in VS Code with access to workspace files and bash commands

### **External Tools**
- **Git**: Version control and conflict resolution
- **TypeScript**: Type checking and compilation
- **npm**: Package management (express, typescript, tsx)
- **Bash**: File operations and git commands

---

## Agent Instructions & Configuration

No explicit agent instruction files were created for this project. Development was guided by:

1. **Implicit Requirements** from the user's requests:
   - Create `/categories` endpoint → fetch unique categories from FakeStoreAPI
   - Create `/fetchAllProducts` endpoint → fetch all products
   - Clean up unused code → remove `post()` method from HttpAccessor
   - Remove user endpoint → delete UserController.ts and POST /users

2. **TypeScript Best Practices**:
   - Strict mode enabled
   - Proper error types (`ProductResponse`, `ErrorResponse`)
   - Separation of concerns (controllers, accessors, responses)

3. **Code Style**:
   - Minimal comments (code is self-documenting)
   - Consistent error handling (502 for upstream failures, 400 for bad input, 404 for not found)

---

## Plan & Specification

### Initial Specification (Implicit)
The service should:
1. ✅ Orchestrate product data from FakeStoreAPI
2. ✅ Provide endpoints to fetch all products, search, get featured, and get by ID
3. ✅ Provide an endpoint to list all unique categories
4. ✅ Handle errors gracefully (400, 404, 502)
5. ✅ Remove unnecessary user management logic
6. ✅ Include comprehensive documentation (README, DECISIONS, AI_USAGE)

### Approach
1. **Understand Current Codebase**: Reviewed existing project structure (controllers, accessors, responses)
2. **Add New Endpoints**: Implemented `/categories` and `/fetchAllProducts` by leveraging existing `getProducts()` accessor
3. **Code Cleanup**: Identified and removed unused `post()` method and entire `UserController.ts`
4. **Documentation**: Updated README with endpoint details and created decision/AI usage docs

---

## Key Prompts & Moments

### **Moment 1: Initial Task Clarification**
**Prompt**: "Create a endpoint /categories... This will return all the categories as array"
- **What Happened**: User provided clear requirements for new endpoint
- **My Response**: Quickly implemented by leveraging existing `getProducts()` and using `Set` to get unique categories
- **Outcome**: Clean, efficient solution in one attempt

### **Moment 2: Bulk Product Fetch**
**Prompt**: "Create a endpoints /fetchAllProducts to get all products... call https://fakestoreapi.com/products"
- **What Happened**: User requested another straightforward endpoint
- **My Response**: Created handler that simply returns all products without filtering
- **Outcome**: Minimal code addition; reused existing accessor pattern

### **Moment 3: Code Cleanup Decision**
**Prompt**: "Cleanup the code which is not used"
- **What Happened**: User asked to remove dead code
- **My Response**: 
  - Identified unused `post()` method in HttpAccessor
  - Identified unused `UserController.ts` and `createUser` function
  - Suggested removal with reasoning
- **Outcome**: Cleaner, more focused codebase

### **Moment 4: Conflict Resolution**
**Prompt**: "Can you resolve conflicts?"
- **What Happened**: Git merge conflict in `.gitignore` with two different versions
- **My Response**: Merged both versions intelligently, keeping all relevant entries while removing duplicates
- **Outcome**: Resolved conflict without losing either version's intended exclusions

### **Moment 5: Complete Removal of User Endpoint**
**Prompt**: "Remove **POST /users** and its logics"
- **What Happened**: User decided to fully scope out user management
- **My Response**: 
  - Removed import in `index.ts`
  - Removed route definition
  - Deleted `UserController.ts`
  - Updated `UserResponse.ts` to only keep `ErrorResponse`
- **Outcome**: Cleaner, product-focused API surface

---

## Where the AI Got Things Wrong & How We Caught It

### **Issue 1: Tool Availability Confusion**
**What Went Wrong**:
- Initially tried to use `edit` and `bash` tools which weren't available in some contexts
- Got errors like "Tool 'edit' does not exist" and "Tool 'bash' does not exist"

**How We Caught It**:
- Read error messages carefully
- Searched for available tools using `tool_search_tool`
- Found alternative approaches (create file directly, use bash via other contexts)

**How It Was Fixed**:
- Used `create` tool for file creation instead of `edit`
- Switched to bash commands that were available in later tool contexts
- Learned that tool availability varies by context/scope

### **Issue 2: Over-Complication of Solutions**
**What Went Wrong**:
- Initially provided verbose README suggesting three different versions

**How We Caught It**:
- User kept asking for updates and clarifications
- Multiple attempts to edit rather than create fresh file

**How It Was Fixed**:
- Switched to creating fresh, complete file with all requirements
- Avoided incremental edits in favor of complete rewrites
- This was more efficient and clear

### **Issue 3: File System Limitations**
**What Went Wrong**:
- Tried to create/edit files but failed multiple times due to tool limitations
- Provided long instructions instead of actually making changes

**How We Caught It**:
- Saw repeated failures with file operations
- User said "Now try" after I provided instructions
- Realized I needed to actually execute changes, not just describe them

**How It Was Fixed**:
- Switched contexts where bash was available
- Used bash redirection (`cat >`) to create files
- Verified with `git status` that changes were actually made

### **Issue 4: Merge Conflict Presentation**
**What Went Wrong**:
- Initially showed the git diff output which was confusing

**How We Caught It**:
- Read through the diff carefully and understood the two versions
- Realized both versions were valid but incomplete

**How It Was Fixed**:
- Merged the best of both versions into a comprehensive `.gitignore`
- Included entries from both sources
- Removed duplicates

---

## Development Decisions & Trade-offs

### **Decision: Keep HttpAccessor Generic**
- **Why**: Allows easy swapping of data sources later
- **Cost**: Slightly more indirection in code
- **Validation**: Worked well when adding new endpoints; reused pattern consistently

### **Decision: No Caching**
- **Why**: Simpler PoC; FakeStoreAPI dataset is small (~20 items)
- **Cost**: Higher latency on each request
- **Validation**: Acceptable for a demo; noted in DECISIONS.md as "revisit when traffic spikes"

### **Decision: Synchronous Error Handling**
- **Why**: Aligns with Express middleware patterns
- **Cost**: No circuit breaker or retry logic
- **Validation**: Clear and testable; can add middleware later

### **Decision: Remove User Management**
- **Why**: Out of scope; clarifies API purpose
- **Cost**: Loses user preferences/personalization
- **Validation**: User explicitly confirmed this was intended

---

## Lessons Learned

1. **User Requirements are Sometimes Implicit**: User didn't explicitly ask for DECISIONS.md and AI_USAGE.md until the end, but it became clear this was important for the deliverable.

2. **Tool Availability Matters**: The same tools aren't always available; need to adapt approach based on what's currently available.

3. **Merge Conflicts Can Be Opportunities**: Both `.gitignore` versions had valid entries; merging them intelligently improved the final result.

4. **Code Cleanup Requires Context**: Knowing *why* code is unused (e.g., user endpoint was a placeholder, not part of core requirements) makes removal decisions easier.

5. **Documentation is Part of the Solution**: The README, DECISIONS.md, and AI_USAGE.md are as important as the code itself for understanding and extending the project.

---

## Verification & Validation

### **Code Works**
- ✅ All 5 endpoints are implemented and registered in `index.ts`
- ✅ No unused imports or dead code
- ✅ TypeScript compiles without errors (strict mode)
- ✅ Git status shows expected changes (deleted UserController, modified index.ts and responses)

### **Documentation Complete**
- ✅ README.md: Complete API reference with examples
- ✅ DECISIONS.md: Design rationale and scalability notes
- ✅ AI_USAGE.md: This file; full transparency on AI process
- ✅ .gitignore: Comprehensive Node.js/TypeScript exclusions

### **Process Transparent**
- ✅ All major decisions documented
- ✅ Trade-offs explained
- ✅ Future improvements outlined
- ✅ AI limitations and corrections noted

---

## Summary

This project demonstrates a pragmatic approach to building a PoC API service:
- **Prioritize clarity** over features
- **Document decisions** as you go
- **Be transparent** about trade-offs
- **Plan for growth** without premature optimization
- **Learn from mistakes** and document them for future reference

The AI assistant provided valuable help with code generation, conflict resolution, and design validation, but human judgment was essential for scoping, prioritization, and final validation.
