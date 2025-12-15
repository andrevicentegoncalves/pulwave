# AI Helpers Directory

This directory contains reference documentation and guides specifically created for AI assistants working on the PulWave project.

## Purpose

These files help AI assistants:
- Quickly understand the database schema and relationships
- Access accurate, up-to-date information about the codebase
- Follow established patterns and conventions
- Troubleshoot common issues

## Files

### [schema-ai.md](./schema-ai.md)
**Database Schema Quick Reference**

Comprehensive reference document covering:
- All database tables and their columns
- Key relationships and foreign keys
- Translation system architecture
- Important constants and patterns
- Common queries and usage examples
- Frontend file structure
- Recent changes and known issues

**When to use**: Before making any database-related changes or when understanding data relationships.

### [TRANSLATION_SETUP_GUIDE.md](./TRANSLATION_SETUP_GUIDE.md)
**Translation System Setup & Usage**

Step-by-step guide for:
- Setting up the translation system
- Creating translation keys
- Testing locale switching
- Troubleshooting common issues
- Understanding translation key formats
- Cache behavior and invalidation

**When to use**: When working with the translation/i18n system or helping users set it up.

## Maintenance

### Updating These Files

These documents should be updated when:

1. **schema-ai.md**:
   - Database schema changes (new tables, columns, relationships)
   - New translation system features
   - Changes to file structure or architecture
   - New important patterns or conventions discovered

2. **TRANSLATION_SETUP_GUIDE.md**:
   - Translation system implementation changes
   - New troubleshooting scenarios discovered
   - Updated setup procedures
   - New best practices identified

### Update Format

When updating, always:
- Add date to "Last Updated" field
- Document changes in "Recent Changes" section
- Maintain consistent formatting
- Include code examples where relevant
- Keep information concise but complete

## Notes for AI Assistants

1. **Always check these files first** before making assumptions about the codebase
2. **Consult schema-ai.md** before any database queries or schema modifications
3. **Reference TRANSLATION_SETUP_GUIDE.md** when helping with translation issues
4. **Update these files** when you discover important information not documented
5. **Keep information accurate** - outdated docs are worse than no docs

## File Organization

```
.ai-helpers/
├── README.md                      # This file
├── schema-ai.md                   # Database schema reference
└── TRANSLATION_SETUP_GUIDE.md     # Translation system guide
```

## Related Documentation

For more detailed information, see:
- [src/schema.md](../src/schema.md) - Full database schema documentation
- [src/services/translationService.js](../src/services/translationService.js) - Translation service implementation
- [src/contexts/TranslationContext.jsx](../src/contexts/TranslationContext.jsx) - Translation context provider

---

**Note**: This directory is for AI assistant reference only. User-facing documentation should be placed in the main docs folder (if created).
