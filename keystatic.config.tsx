import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },

  collections: {
    stories: collection({
      label: 'Stories',
      slugField: 'title',
      path: 'src/content/stories/*/*',
      format: { contentField: 'content' },

      schema: {
        title: fields.slug({ name: { label: 'Title' } }),

        titleAr: fields.text({
          label: 'Title (Arabic)',
        }),

        titleEn: fields.text({
          label: 'Title (English)',
        }),

        titleTr: fields.text({
          label: 'Title (Turkish)',
        }),

        titleUr: fields.text({
          label: 'Title (Urdu)',
        }),

        emoji: fields.text({
          label: 'Emoji',
          description: 'Single emoji character',
        }),

        skills: fields.array(fields.text({ label: 'Skill' }), {
          label: 'Skills Taught',
          itemLabel: props => props.value,
        }),

        ageGroup: fields.text({
          label: 'Age Group',
          description: 'Format: "3-7" or "5-10"',
        }),

        languages: fields.multiselect({
          label: 'Languages',
          options: [
            { label: 'German', value: 'de' },
            { label: 'English', value: 'en' },
            { label: 'Arabic', value: 'ar' },
            { label: 'Turkish', value: 'tr' },
            { label: 'Urdu', value: 'ur' },
          ],
          defaultValue: ['de'],
        }),

        storyId: fields.text({
          label: 'Story ID',
          description: 'Unique identifier (e.g., "001-bruno")',
        }),

        publishDate: fields.date({
          label: 'Publish Date',
        }),

        author: fields.text({
          label: 'Author',
        }),

        provider: fields.select({
          label: 'Content Provider',
          options: [
            { label: 'Local', value: 'local' },
            { label: 'Google Drive', value: 'google-drive' },
            { label: 'External', value: 'external' },
          ],
          defaultValue: 'local',
        }),

        providerUrl: fields.url({
          label: 'Provider URL',
          description: 'Optional: External URL or Google Drive link',
        }),

        characterType: fields.text({
          label: 'Character Type',
          description: 'e.g., "bear", "squirrel", "child"',
        }),

        difficulty: fields.select({
          label: 'Difficulty',
          options: [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
          ],
          defaultValue: 'beginner',
        }),

        estimatedReadTime: fields.number({
          label: 'Estimated Read Time (minutes)',
        }),

        storyFormat: fields.select({
          label: 'Story Format',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Interactive', value: 'interactive' },
          ],
          defaultValue: 'standard',
        }),

        pages: fields.array(
          fields.object({
            text: fields.text({
              label: 'Page Text',
              multiline: true,
            }),

            image: fields.text({
              label: 'Page Image URL',
            }),
          }),
          {
            label: 'Story Pages (Interactive Format Only)',
            itemLabel: props => `Page: ${props.fields.text.value?.substring(0, 30) || 'Empty'}...`,
          }
        ),

        content: fields.document({
          label: 'Story Content',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/images/stories',
            publicPath: '/images/stories/',
          },
        }),
      },
    }),
  },
});
