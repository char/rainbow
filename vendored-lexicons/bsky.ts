declare module "@atcute/client/lexicons" {
  namespace AppBskyActorDefs {
    interface AdultContentPref {
      [Brand.Type]?: "app.bsky.actor.defs#adultContentPref";
      /** @default false */
      enabled: boolean;
    }
    /** If set, an active progress guide. Once completed, can be set to undefined. Should have unspecced fields tracking progress. */
    interface BskyAppProgressGuide {
      [Brand.Type]?: "app.bsky.actor.defs#bskyAppProgressGuide";
      /** Maximum string length: 100 */
      guide: string;
    }
    /** A grab bag of state that's specific to the bsky.app program. Third-party apps shouldn't use this. */
    interface BskyAppStatePref {
      [Brand.Type]?: "app.bsky.actor.defs#bskyAppStatePref";
      activeProgressGuide?: BskyAppProgressGuide;
      /**
       * Storage for NUXs the user has encountered. \
       * Maximum array length: 100
       */
      nuxs?: AppBskyActorDefs.Nux[];
      /**
       * An array of tokens which identify nudges (modals, popups, tours, highlight dots) that should be shown to the user. \
       * Maximum array length: 1000 \
       * Maximum string length: 100
       */
      queuedNudges?: string[];
    }
    interface ContentLabelPref {
      [Brand.Type]?: "app.bsky.actor.defs#contentLabelPref";
      label: string;
      visibility: "hide" | "ignore" | "show" | "warn" | (string & {});
      /** Which labeler does this preference apply to? If undefined, applies globally. */
      labelerDid?: At.DID;
    }
    interface FeedViewPref {
      [Brand.Type]?: "app.bsky.actor.defs#feedViewPref";
      /** The URI of the feed, or an identifier which describes the feed. */
      feed: string;
      /** Hide quote posts in the feed. */
      hideQuotePosts?: boolean;
      /** Hide replies in the feed. */
      hideReplies?: boolean;
      /** Hide replies in the feed if they do not have this number of likes. */
      hideRepliesByLikeCount?: number;
      /**
       * Hide replies in the feed if they are not by followed users.
       * @default true
       */
      hideRepliesByUnfollowed?: boolean;
      /** Hide reposts in the feed. */
      hideReposts?: boolean;
    }
    interface HiddenPostsPref {
      [Brand.Type]?: "app.bsky.actor.defs#hiddenPostsPref";
      /** A list of URIs of posts the account owner has hidden. */
      items: At.Uri[];
    }
    interface InterestsPref {
      [Brand.Type]?: "app.bsky.actor.defs#interestsPref";
      /**
       * A list of tags which describe the account owner's interests gathered during onboarding. \
       * Maximum array length: 100 \
       * Maximum string length: 640 \
       * Maximum grapheme length: 64
       */
      tags: string[];
    }
    /** The subject's followers whom you also follow */
    interface KnownFollowers {
      [Brand.Type]?: "app.bsky.actor.defs#knownFollowers";
      count: number;
      /**
       * Minimum array length: 0 \
       * Maximum array length: 5
       */
      followers: ProfileViewBasic[];
    }
    interface LabelerPrefItem {
      [Brand.Type]?: "app.bsky.actor.defs#labelerPrefItem";
      did: At.DID;
    }
    interface LabelersPref {
      [Brand.Type]?: "app.bsky.actor.defs#labelersPref";
      labelers: LabelerPrefItem[];
    }
    /** A word that the account owner has muted. */
    interface MutedWord {
      [Brand.Type]?: "app.bsky.actor.defs#mutedWord";
      /** The intended targets of the muted word. */
      targets: AppBskyActorDefs.MutedWordTarget[];
      /**
       * The muted word itself. \
       * Maximum string length: 10000 \
       * Maximum grapheme length: 1000
       */
      value: string;
      /**
       * Groups of users to apply the muted word to. If undefined, applies to all users.
       * @default "all"
       */
      actorTarget?: "all" | "exclude-following" | (string & {});
      /** The date and time at which the muted word will expire and no longer be applied. */
      expiresAt?: string;
      id?: string;
    }
    interface MutedWordsPref {
      [Brand.Type]?: "app.bsky.actor.defs#mutedWordsPref";
      /** A list of words the account owner has muted. */
      items: AppBskyActorDefs.MutedWord[];
    }
    /**
     * Maximum string length: 640 \
     * Maximum grapheme length: 64
     */
    type MutedWordTarget = "content" | "tag" | (string & {});
    /** A new user experiences (NUX) storage object */
    interface Nux {
      [Brand.Type]?: "app.bsky.actor.defs#nux";
      /** @default false */
      completed: boolean;
      /** Maximum string length: 100 */
      id: string;
      /**
       * Arbitrary data for the NUX. The structure is defined by the NUX itself. Limited to 300 characters. \
       * Maximum string length: 3000 \
       * Maximum grapheme length: 300
       */
      data?: string;
      /** The date and time at which the NUX will expire and should be considered completed. */
      expiresAt?: string;
    }
    interface PersonalDetailsPref {
      [Brand.Type]?: "app.bsky.actor.defs#personalDetailsPref";
      /** The birth date of account owner. */
      birthDate?: string;
    }
    type Preferences = Brand.Union<
      | AdultContentPref
      | BskyAppStatePref
      | ContentLabelPref
      | FeedViewPref
      | HiddenPostsPref
      | InterestsPref
      | LabelersPref
      | MutedWordsPref
      | PersonalDetailsPref
      | SavedFeedsPref
      | SavedFeedsPrefV2
      | ThreadViewPref
    >[];
    interface ProfileAssociated {
      [Brand.Type]?: "app.bsky.actor.defs#profileAssociated";
      chat?: ProfileAssociatedChat;
      feedgens?: number;
      labeler?: boolean;
      lists?: number;
      starterPacks?: number;
    }
    interface ProfileAssociatedChat {
      [Brand.Type]?: "app.bsky.actor.defs#profileAssociatedChat";
      allowIncoming: "all" | "following" | "none" | (string & {});
    }
    interface ProfileView {
      [Brand.Type]?: "app.bsky.actor.defs#profileView";
      did: At.DID;
      handle: At.Handle;
      associated?: ProfileAssociated;
      avatar?: string;
      createdAt?: string;
      /**
       * Maximum string length: 2560 \
       * Maximum grapheme length: 256
       */
      description?: string;
      /**
       * Maximum string length: 640 \
       * Maximum grapheme length: 64
       */
      displayName?: string;
      indexedAt?: string;
      labels?: ComAtprotoLabelDefs.Label[];
      viewer?: ViewerState;
    }
    interface ProfileViewBasic {
      [Brand.Type]?: "app.bsky.actor.defs#profileViewBasic";
      did: At.DID;
      handle: At.Handle;
      associated?: ProfileAssociated;
      avatar?: string;
      createdAt?: string;
      /**
       * Maximum string length: 640 \
       * Maximum grapheme length: 64
       */
      displayName?: string;
      labels?: ComAtprotoLabelDefs.Label[];
      viewer?: ViewerState;
    }
    interface ProfileViewDetailed {
      [Brand.Type]?: "app.bsky.actor.defs#profileViewDetailed";
      did: At.DID;
      handle: At.Handle;
      associated?: ProfileAssociated;
      avatar?: string;
      banner?: string;
      createdAt?: string;
      /**
       * Maximum string length: 2560 \
       * Maximum grapheme length: 256
       */
      description?: string;
      /**
       * Maximum string length: 640 \
       * Maximum grapheme length: 64
       */
      displayName?: string;
      followersCount?: number;
      followsCount?: number;
      indexedAt?: string;
      joinedViaStarterPack?: AppBskyGraphDefs.StarterPackViewBasic;
      labels?: ComAtprotoLabelDefs.Label[];
      pinnedPost?: ComAtprotoRepoStrongRef.Main;
      postsCount?: number;
      viewer?: ViewerState;
    }
    interface SavedFeed {
      [Brand.Type]?: "app.bsky.actor.defs#savedFeed";
      id: string;
      pinned: boolean;
      type: "feed" | "list" | "timeline" | (string & {});
      value: string;
    }
    interface SavedFeedsPref {
      [Brand.Type]?: "app.bsky.actor.defs#savedFeedsPref";
      pinned: At.Uri[];
      saved: At.Uri[];
      timelineIndex?: number;
    }
    interface SavedFeedsPrefV2 {
      [Brand.Type]?: "app.bsky.actor.defs#savedFeedsPrefV2";
      items: AppBskyActorDefs.SavedFeed[];
    }
    interface ThreadViewPref {
      [Brand.Type]?: "app.bsky.actor.defs#threadViewPref";
      /** Show followed users at the top of all replies. */
      prioritizeFollowedUsers?: boolean;
      /** Sorting mode for threads. */
      sort?: "most-likes" | "newest" | "oldest" | "random" | (string & {});
    }
    /** Metadata about the requesting account's relationship with the subject account. Only has meaningful content for authed requests. */
    interface ViewerState {
      [Brand.Type]?: "app.bsky.actor.defs#viewerState";
      blockedBy?: boolean;
      blocking?: At.Uri;
      blockingByList?: AppBskyGraphDefs.ListViewBasic;
      followedBy?: At.Uri;
      following?: At.Uri;
      knownFollowers?: KnownFollowers;
      muted?: boolean;
      mutedByList?: AppBskyGraphDefs.ListViewBasic;
    }
  }
  /** Get private preferences attached to the current account. Expected use is synchronization between multiple devices, and import/export during account migration. Requires auth. */
  namespace AppBskyActorGetPreferences {
    type Input = undefined;
    interface Output {
      preferences: AppBskyActorDefs.Preferences;
    }
  }
  /** Get detailed profile view of an actor. Does not require auth, but contains relevant metadata with auth. */
  namespace AppBskyActorGetProfile {
    interface Params {
      /** Handle or DID of account to fetch profile of. */
      actor: string;
    }
    type Input = undefined;
    type Output = AppBskyActorDefs.ProfileViewDetailed;
  }
  /** Get detailed profile views of multiple actors. */
  namespace AppBskyActorGetProfiles {
    interface Params {
      /** Maximum array length: 25 */
      actors: string[];
    }
    type Input = undefined;
    interface Output {
      profiles: AppBskyActorDefs.ProfileViewDetailed[];
    }
  }
  /** Get a list of suggested actors. Expected use is discovery of accounts to follow during new account onboarding. */
  namespace AppBskyActorGetSuggestions {
    interface Params {
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      actors: AppBskyActorDefs.ProfileView[];
      cursor?: string;
    }
  }
  namespace AppBskyActorProfile {
    /** A declaration of a Bluesky account profile. */
    interface Record {
      $type: "app.bsky.actor.profile";
      /** Small image to be displayed next to posts from account. AKA, 'profile picture' */
      avatar?: At.Blob;
      /** Larger horizontal image to display behind profile view. */
      banner?: At.Blob;
      createdAt?: string;
      /**
       * Free-form profile description text. \
       * Maximum string length: 2560 \
       * Maximum grapheme length: 256
       */
      description?: string;
      /**
       * Maximum string length: 640 \
       * Maximum grapheme length: 64
       */
      displayName?: string;
      joinedViaStarterPack?: ComAtprotoRepoStrongRef.Main;
      /** Self-label values, specific to the Bluesky application, on the overall account. */
      labels?: Brand.Union<ComAtprotoLabelDefs.SelfLabels>;
      pinnedPost?: ComAtprotoRepoStrongRef.Main;
    }
  }
  /** Set the private preferences attached to the account. */
  namespace AppBskyActorPutPreferences {
    interface Params {}
    interface Input {
      preferences: AppBskyActorDefs.Preferences;
    }
    type Output = undefined;
  }
  /** Find actors (profiles) matching search criteria. Does not require auth. */
  namespace AppBskyActorSearchActors {
    interface Params {
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 25
       */
      limit?: number;
      /** Search query string. Syntax, phrase, boolean, and faceting is unspecified, but Lucene query syntax is recommended. */
      q?: string;
      /**
       * DEPRECATED: use 'q' instead.
       * @deprecated
       */
      term?: string;
    }
    type Input = undefined;
    interface Output {
      actors: AppBskyActorDefs.ProfileView[];
      cursor?: string;
    }
  }
  /** Find actor suggestions for a prefix search term. Expected use is for auto-completion during text field entry. Does not require auth. */
  namespace AppBskyActorSearchActorsTypeahead {
    interface Params {
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 10
       */
      limit?: number;
      /** Search query prefix; not a full query string. */
      q?: string;
      /**
       * DEPRECATED: use 'q' instead.
       * @deprecated
       */
      term?: string;
    }
    type Input = undefined;
    interface Output {
      actors: AppBskyActorDefs.ProfileViewBasic[];
    }
  }
  namespace AppBskyEmbedDefs {
    /** width:height represents an aspect ratio. It may be approximate, and may not correspond to absolute dimensions in any given unit. */
    interface AspectRatio {
      [Brand.Type]?: "app.bsky.embed.defs#aspectRatio";
      /** Minimum: 1 */
      height: number;
      /** Minimum: 1 */
      width: number;
    }
  }
  namespace AppBskyEmbedExternal {
    /** A representation of some externally linked content (eg, a URL and 'card'), embedded in a Bluesky record (eg, a post). */
    interface Main {
      [Brand.Type]?: "app.bsky.embed.external";
      external: External;
    }
    interface External {
      [Brand.Type]?: "app.bsky.embed.external#external";
      description: string;
      title: string;
      uri: string;
      thumb?: At.Blob;
    }
    interface View {
      [Brand.Type]?: "app.bsky.embed.external#view";
      external: ViewExternal;
    }
    interface ViewExternal {
      [Brand.Type]?: "app.bsky.embed.external#viewExternal";
      description: string;
      title: string;
      uri: string;
      thumb?: string;
    }
  }
  namespace AppBskyEmbedImages {
    interface Main {
      [Brand.Type]?: "app.bsky.embed.images";
      /** Maximum array length: 4 */
      images: Image[];
    }
    interface Image {
      [Brand.Type]?: "app.bsky.embed.images#image";
      /** Alt text description of the image, for accessibility. */
      alt: string;
      image: At.Blob;
      aspectRatio?: AppBskyEmbedDefs.AspectRatio;
    }
    interface View {
      [Brand.Type]?: "app.bsky.embed.images#view";
      /** Maximum array length: 4 */
      images: ViewImage[];
    }
    interface ViewImage {
      [Brand.Type]?: "app.bsky.embed.images#viewImage";
      /** Alt text description of the image, for accessibility. */
      alt: string;
      /** Fully-qualified URL where a large version of the image can be fetched. May or may not be the exact original blob. For example, CDN location provided by the App View. */
      fullsize: string;
      /** Fully-qualified URL where a thumbnail of the image can be fetched. For example, CDN location provided by the App View. */
      thumb: string;
      aspectRatio?: AppBskyEmbedDefs.AspectRatio;
    }
  }
  namespace AppBskyEmbedRecord {
    interface Main {
      [Brand.Type]?: "app.bsky.embed.record";
      record: ComAtprotoRepoStrongRef.Main;
    }
    interface View {
      [Brand.Type]?: "app.bsky.embed.record#view";
      record: Brand.Union<
        | ViewBlocked
        | ViewDetached
        | ViewNotFound
        | ViewRecord
        | AppBskyFeedDefs.GeneratorView
        | AppBskyGraphDefs.ListView
        | AppBskyGraphDefs.StarterPackViewBasic
        | AppBskyLabelerDefs.LabelerView
      >;
    }
    interface ViewBlocked {
      [Brand.Type]?: "app.bsky.embed.record#viewBlocked";
      author: AppBskyFeedDefs.BlockedAuthor;
      blocked: boolean;
      uri: At.Uri;
    }
    interface ViewDetached {
      [Brand.Type]?: "app.bsky.embed.record#viewDetached";
      detached: boolean;
      uri: At.Uri;
    }
    interface ViewNotFound {
      [Brand.Type]?: "app.bsky.embed.record#viewNotFound";
      notFound: boolean;
      uri: At.Uri;
    }
    interface ViewRecord {
      [Brand.Type]?: "app.bsky.embed.record#viewRecord";
      author: AppBskyActorDefs.ProfileViewBasic;
      cid: At.CID;
      indexedAt: string;
      uri: At.Uri;
      /** The record data itself. */
      value: unknown;
      embeds?: Brand.Union<
        | AppBskyEmbedExternal.View
        | AppBskyEmbedImages.View
        | AppBskyEmbedRecord.View
        | AppBskyEmbedRecordWithMedia.View
        | AppBskyEmbedVideo.View
      >[];
      labels?: ComAtprotoLabelDefs.Label[];
      likeCount?: number;
      quoteCount?: number;
      replyCount?: number;
      repostCount?: number;
    }
  }
  namespace AppBskyEmbedRecordWithMedia {
    interface Main {
      [Brand.Type]?: "app.bsky.embed.recordWithMedia";
      media: Brand.Union<
        AppBskyEmbedExternal.Main | AppBskyEmbedImages.Main | AppBskyEmbedVideo.Main
      >;
      record: AppBskyEmbedRecord.Main;
    }
    interface View {
      [Brand.Type]?: "app.bsky.embed.recordWithMedia#view";
      media: Brand.Union<
        AppBskyEmbedExternal.View | AppBskyEmbedImages.View | AppBskyEmbedVideo.View
      >;
      record: AppBskyEmbedRecord.View;
    }
  }
  namespace AppBskyEmbedVideo {
    interface Main {
      [Brand.Type]?: "app.bsky.embed.video";
      video: At.Blob;
      /**
       * Alt text description of the video, for accessibility. \
       * Maximum string length: 10000 \
       * Maximum grapheme length: 1000
       */
      alt?: string;
      aspectRatio?: AppBskyEmbedDefs.AspectRatio;
      /** Maximum array length: 20 */
      captions?: Caption[];
    }
    interface Caption {
      [Brand.Type]?: "app.bsky.embed.video#caption";
      file: At.Blob;
      lang: string;
    }
    interface View {
      [Brand.Type]?: "app.bsky.embed.video#view";
      cid: At.CID;
      playlist: string;
      /**
       * Maximum string length: 10000 \
       * Maximum grapheme length: 1000
       */
      alt?: string;
      aspectRatio?: AppBskyEmbedDefs.AspectRatio;
      thumbnail?: string;
    }
  }
  namespace AppBskyFeedDefs {
    interface BlockedAuthor {
      [Brand.Type]?: "app.bsky.feed.defs#blockedAuthor";
      did: At.DID;
      viewer?: AppBskyActorDefs.ViewerState;
    }
    interface BlockedPost {
      [Brand.Type]?: "app.bsky.feed.defs#blockedPost";
      author: BlockedAuthor;
      blocked: boolean;
      uri: At.Uri;
    }
    type ClickthroughAuthor = "app.bsky.feed.defs#clickthroughAuthor";
    type ClickthroughEmbed = "app.bsky.feed.defs#clickthroughEmbed";
    type ClickthroughItem = "app.bsky.feed.defs#clickthroughItem";
    type ClickthroughReposter = "app.bsky.feed.defs#clickthroughReposter";
    interface FeedViewPost {
      [Brand.Type]?: "app.bsky.feed.defs#feedViewPost";
      post: PostView;
      /**
       * Context provided by feed generator that may be passed back alongside interactions. \
       * Maximum string length: 2000
       */
      feedContext?: string;
      reason?: Brand.Union<ReasonPin | ReasonRepost>;
      reply?: ReplyRef;
    }
    interface GeneratorView {
      [Brand.Type]?: "app.bsky.feed.defs#generatorView";
      cid: At.CID;
      creator: AppBskyActorDefs.ProfileView;
      did: At.DID;
      displayName: string;
      indexedAt: string;
      uri: At.Uri;
      acceptsInteractions?: boolean;
      avatar?: string;
      /**
       * Maximum string length: 3000 \
       * Maximum grapheme length: 300
       */
      description?: string;
      descriptionFacets?: AppBskyRichtextFacet.Main[];
      labels?: ComAtprotoLabelDefs.Label[];
      /** Minimum: 0 */
      likeCount?: number;
      viewer?: GeneratorViewerState;
    }
    interface GeneratorViewerState {
      [Brand.Type]?: "app.bsky.feed.defs#generatorViewerState";
      like?: At.Uri;
    }
    interface Interaction {
      [Brand.Type]?: "app.bsky.feed.defs#interaction";
      event?:
        | "app.bsky.feed.defs#clickthroughAuthor"
        | "app.bsky.feed.defs#clickthroughEmbed"
        | "app.bsky.feed.defs#clickthroughItem"
        | "app.bsky.feed.defs#clickthroughReposter"
        | "app.bsky.feed.defs#interactionLike"
        | "app.bsky.feed.defs#interactionQuote"
        | "app.bsky.feed.defs#interactionReply"
        | "app.bsky.feed.defs#interactionRepost"
        | "app.bsky.feed.defs#interactionSeen"
        | "app.bsky.feed.defs#interactionShare"
        | "app.bsky.feed.defs#requestLess"
        | "app.bsky.feed.defs#requestMore"
        | (string & {});
      /**
       * Context on a feed item that was originally supplied by the feed generator on getFeedSkeleton. \
       * Maximum string length: 2000
       */
      feedContext?: string;
      item?: At.Uri;
    }
    type InteractionLike = "app.bsky.feed.defs#interactionLike";
    type InteractionQuote = "app.bsky.feed.defs#interactionQuote";
    type InteractionReply = "app.bsky.feed.defs#interactionReply";
    type InteractionRepost = "app.bsky.feed.defs#interactionRepost";
    type InteractionSeen = "app.bsky.feed.defs#interactionSeen";
    type InteractionShare = "app.bsky.feed.defs#interactionShare";
    interface NotFoundPost {
      [Brand.Type]?: "app.bsky.feed.defs#notFoundPost";
      notFound: boolean;
      uri: At.Uri;
    }
    interface PostView {
      [Brand.Type]?: "app.bsky.feed.defs#postView";
      author: AppBskyActorDefs.ProfileViewBasic;
      cid: At.CID;
      indexedAt: string;
      record: unknown;
      uri: At.Uri;
      embed?: Brand.Union<
        | AppBskyEmbedExternal.View
        | AppBskyEmbedImages.View
        | AppBskyEmbedRecord.View
        | AppBskyEmbedRecordWithMedia.View
        | AppBskyEmbedVideo.View
      >;
      labels?: ComAtprotoLabelDefs.Label[];
      likeCount?: number;
      quoteCount?: number;
      replyCount?: number;
      repostCount?: number;
      threadgate?: ThreadgateView;
      viewer?: ViewerState;
    }
    interface ReasonPin {
      [Brand.Type]?: "app.bsky.feed.defs#reasonPin";
    }
    interface ReasonRepost {
      [Brand.Type]?: "app.bsky.feed.defs#reasonRepost";
      by: AppBskyActorDefs.ProfileViewBasic;
      indexedAt: string;
    }
    interface ReplyRef {
      [Brand.Type]?: "app.bsky.feed.defs#replyRef";
      parent: Brand.Union<BlockedPost | NotFoundPost | PostView>;
      root: Brand.Union<BlockedPost | NotFoundPost | PostView>;
      /** When parent is a reply to another post, this is the author of that post. */
      grandparentAuthor?: AppBskyActorDefs.ProfileViewBasic;
    }
    type RequestLess = "app.bsky.feed.defs#requestLess";
    type RequestMore = "app.bsky.feed.defs#requestMore";
    interface SkeletonFeedPost {
      [Brand.Type]?: "app.bsky.feed.defs#skeletonFeedPost";
      post: At.Uri;
      /**
       * Context that will be passed through to client and may be passed to feed generator back alongside interactions. \
       * Maximum string length: 2000
       */
      feedContext?: string;
      reason?: Brand.Union<SkeletonReasonPin | SkeletonReasonRepost>;
    }
    interface SkeletonReasonPin {
      [Brand.Type]?: "app.bsky.feed.defs#skeletonReasonPin";
    }
    interface SkeletonReasonRepost {
      [Brand.Type]?: "app.bsky.feed.defs#skeletonReasonRepost";
      repost: At.Uri;
    }
    interface ThreadgateView {
      [Brand.Type]?: "app.bsky.feed.defs#threadgateView";
      cid?: At.CID;
      lists?: AppBskyGraphDefs.ListViewBasic[];
      record?: unknown;
      uri?: At.Uri;
    }
    interface ThreadViewPost {
      [Brand.Type]?: "app.bsky.feed.defs#threadViewPost";
      post: PostView;
      parent?: Brand.Union<BlockedPost | NotFoundPost | ThreadViewPost>;
      replies?: Brand.Union<BlockedPost | NotFoundPost | ThreadViewPost>[];
    }
    /** Metadata about the requesting account's relationship with the subject content. Only has meaningful content for authed requests. */
    interface ViewerState {
      [Brand.Type]?: "app.bsky.feed.defs#viewerState";
      embeddingDisabled?: boolean;
      like?: At.Uri;
      pinned?: boolean;
      replyDisabled?: boolean;
      repost?: At.Uri;
      threadMuted?: boolean;
    }
  }
  /** Get information about a feed generator, including policies and offered feed URIs. Does not require auth; implemented by Feed Generator services (not App View). */
  namespace AppBskyFeedDescribeFeedGenerator {
    interface Params {}
    type Input = undefined;
    interface Output {
      did: At.DID;
      feeds: Feed[];
      links?: Links;
    }
    interface Feed {
      [Brand.Type]?: "app.bsky.feed.describeFeedGenerator#feed";
      uri: At.Uri;
    }
    interface Links {
      [Brand.Type]?: "app.bsky.feed.describeFeedGenerator#links";
      privacyPolicy?: string;
      termsOfService?: string;
    }
  }
  namespace AppBskyFeedGenerator {
    /** Record declaring of the existence of a feed generator, and containing metadata about it. The record can exist in any repository. */
    interface Record {
      $type: "app.bsky.feed.generator";
      createdAt: string;
      did: At.DID;
      /**
       * Maximum string length: 240 \
       * Maximum grapheme length: 24
       */
      displayName: string;
      /** Declaration that a feed accepts feedback interactions from a client through app.bsky.feed.sendInteractions */
      acceptsInteractions?: boolean;
      avatar?: At.Blob;
      /**
       * Maximum string length: 3000 \
       * Maximum grapheme length: 300
       */
      description?: string;
      descriptionFacets?: AppBskyRichtextFacet.Main[];
      /** Self-label values */
      labels?: Brand.Union<ComAtprotoLabelDefs.SelfLabels>;
    }
  }
  /** Get a list of feeds (feed generator records) created by the actor (in the actor's repo). */
  namespace AppBskyFeedGetActorFeeds {
    interface Params {
      actor: string;
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      feeds: AppBskyFeedDefs.GeneratorView[];
      cursor?: string;
    }
  }
  /** Get a list of posts liked by an actor. Requires auth, actor must be the requesting account. */
  namespace AppBskyFeedGetActorLikes {
    interface Params {
      actor: string;
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      feed: AppBskyFeedDefs.FeedViewPost[];
      cursor?: string;
    }
    interface Errors {
      BlockedActor: {};
      BlockedByActor: {};
    }
  }
  /** Get a view of an actor's 'author feed' (post and reposts by the author). Does not require auth. */
  namespace AppBskyFeedGetAuthorFeed {
    interface Params {
      actor: string;
      cursor?: string;
      /**
       * Combinations of post/repost types to include in response.
       * @default "posts_with_replies"
       */
      filter?:
        | "posts_and_author_threads"
        | "posts_no_replies"
        | "posts_with_media"
        | "posts_with_replies"
        | (string & {});
      /** @default false */
      includePins?: boolean;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      feed: AppBskyFeedDefs.FeedViewPost[];
      cursor?: string;
    }
    interface Errors {
      BlockedActor: {};
      BlockedByActor: {};
    }
  }
  /** Get a hydrated feed from an actor's selected feed generator. Implemented by App View. */
  namespace AppBskyFeedGetFeed {
    interface Params {
      feed: At.Uri;
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      feed: AppBskyFeedDefs.FeedViewPost[];
      cursor?: string;
    }
    interface Errors {
      UnknownFeed: {};
    }
  }
  /** Get information about a feed generator. Implemented by AppView. */
  namespace AppBskyFeedGetFeedGenerator {
    interface Params {
      /** AT-URI of the feed generator record. */
      feed: At.Uri;
    }
    type Input = undefined;
    interface Output {
      /** Indicates whether the feed generator service has been online recently, or else seems to be inactive. */
      isOnline: boolean;
      /** Indicates whether the feed generator service is compatible with the record declaration. */
      isValid: boolean;
      view: AppBskyFeedDefs.GeneratorView;
    }
  }
  /** Get information about a list of feed generators. */
  namespace AppBskyFeedGetFeedGenerators {
    interface Params {
      feeds: At.Uri[];
    }
    type Input = undefined;
    interface Output {
      feeds: AppBskyFeedDefs.GeneratorView[];
    }
  }
  /** Get a skeleton of a feed provided by a feed generator. Auth is optional, depending on provider requirements, and provides the DID of the requester. Implemented by Feed Generator Service. */
  namespace AppBskyFeedGetFeedSkeleton {
    interface Params {
      /** Reference to feed generator record describing the specific feed being requested. */
      feed: At.Uri;
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      feed: AppBskyFeedDefs.SkeletonFeedPost[];
      cursor?: string;
    }
    interface Errors {
      UnknownFeed: {};
    }
  }
  /** Get like records which reference a subject (by AT-URI and CID). */
  namespace AppBskyFeedGetLikes {
    interface Params {
      /** AT-URI of the subject (eg, a post record). */
      uri: At.Uri;
      /** CID of the subject record (aka, specific version of record), to filter likes. */
      cid?: At.CID;
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      likes: Like[];
      uri: At.Uri;
      cid?: At.CID;
      cursor?: string;
    }
    interface Like {
      [Brand.Type]?: "app.bsky.feed.getLikes#like";
      actor: AppBskyActorDefs.ProfileView;
      createdAt: string;
      indexedAt: string;
    }
  }
  /** Get a feed of recent posts from a list (posts and reposts from any actors on the list). Does not require auth. */
  namespace AppBskyFeedGetListFeed {
    interface Params {
      /** Reference (AT-URI) to the list record. */
      list: At.Uri;
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      feed: AppBskyFeedDefs.FeedViewPost[];
      cursor?: string;
    }
    interface Errors {
      UnknownList: {};
    }
  }
  /** Gets post views for a specified list of posts (by AT-URI). This is sometimes referred to as 'hydrating' a 'feed skeleton'. */
  namespace AppBskyFeedGetPosts {
    interface Params {
      /**
       * List of post AT-URIs to return hydrated views for. \
       * Maximum array length: 25
       */
      uris: At.Uri[];
    }
    type Input = undefined;
    interface Output {
      posts: AppBskyFeedDefs.PostView[];
    }
  }
  /** Get posts in a thread. Does not require auth, but additional metadata and filtering will be applied for authed requests. */
  namespace AppBskyFeedGetPostThread {
    interface Params {
      /** Reference (AT-URI) to post record. */
      uri: At.Uri;
      /**
       * How many levels of reply depth should be included in response. \
       * Minimum: 0 \
       * Maximum: 1000
       * @default 6
       */
      depth?: number;
      /**
       * How many levels of parent (and grandparent, etc) post to include. \
       * Minimum: 0 \
       * Maximum: 1000
       * @default 80
       */
      parentHeight?: number;
    }
    type Input = undefined;
    interface Output {
      thread: Brand.Union<
        | AppBskyFeedDefs.BlockedPost
        | AppBskyFeedDefs.NotFoundPost
        | AppBskyFeedDefs.ThreadViewPost
      >;
      threadgate?: AppBskyFeedDefs.ThreadgateView;
    }
    interface Errors {
      NotFound: {};
    }
  }
  /** Get a list of quotes for a given post. */
  namespace AppBskyFeedGetQuotes {
    interface Params {
      /** Reference (AT-URI) of post record */
      uri: At.Uri;
      /** If supplied, filters to quotes of specific version (by CID) of the post record. */
      cid?: At.CID;
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      posts: AppBskyFeedDefs.PostView[];
      uri: At.Uri;
      cid?: At.CID;
      cursor?: string;
    }
  }
  /** Get a list of reposts for a given post. */
  namespace AppBskyFeedGetRepostedBy {
    interface Params {
      /** Reference (AT-URI) of post record */
      uri: At.Uri;
      /** If supplied, filters to reposts of specific version (by CID) of the post record. */
      cid?: At.CID;
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      repostedBy: AppBskyActorDefs.ProfileView[];
      uri: At.Uri;
      cid?: At.CID;
      cursor?: string;
    }
  }
  /** Get a list of suggested feeds (feed generators) for the requesting account. */
  namespace AppBskyFeedGetSuggestedFeeds {
    interface Params {
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      feeds: AppBskyFeedDefs.GeneratorView[];
      cursor?: string;
    }
  }
  /** Get a view of the requesting account's home timeline. This is expected to be some form of reverse-chronological feed. */
  namespace AppBskyFeedGetTimeline {
    interface Params {
      /** Variant 'algorithm' for timeline. Implementation-specific. NOTE: most feed flexibility has been moved to feed generator mechanism. */
      algorithm?: string;
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      feed: AppBskyFeedDefs.FeedViewPost[];
      cursor?: string;
    }
  }
  namespace AppBskyFeedLike {
    /** Record declaring a 'like' of a piece of subject content. */
    interface Record {
      $type: "app.bsky.feed.like";
      createdAt: string;
      subject: ComAtprotoRepoStrongRef.Main;
    }
  }
  namespace AppBskyFeedPost {
    /** Record containing a Bluesky post. */
    interface Record {
      $type: "app.bsky.feed.post";
      /** Client-declared timestamp when this post was originally created. */
      createdAt: string;
      /**
       * The primary post content. May be an empty string, if there are embeds. \
       * Maximum string length: 3000 \
       * Maximum grapheme length: 300
       */
      text: string;
      embed?: Brand.Union<
        | AppBskyEmbedExternal.Main
        | AppBskyEmbedImages.Main
        | AppBskyEmbedRecord.Main
        | AppBskyEmbedRecordWithMedia.Main
        | AppBskyEmbedVideo.Main
      >;
      /**
       * DEPRECATED: replaced by app.bsky.richtext.facet.
       * @deprecated
       */
      entities?: Entity[];
      /** Annotations of text (mentions, URLs, hashtags, etc) */
      facets?: AppBskyRichtextFacet.Main[];
      /** Self-label values for this post. Effectively content warnings. */
      labels?: Brand.Union<ComAtprotoLabelDefs.SelfLabels>;
      /**
       * Indicates human language of post primary text content. \
       * Maximum array length: 3
       */
      langs?: string[];
      reply?: ReplyRef;
      /**
       * Additional hashtags, in addition to any included in post text and facets. \
       * Maximum array length: 8 \
       * Maximum string length: 640 \
       * Maximum grapheme length: 64
       */
      tags?: string[];
    }
    /**
     * Deprecated: use facets instead.
     * @deprecated
     */
    interface Entity {
      [Brand.Type]?: "app.bsky.feed.post#entity";
      index: TextSlice;
      /** Expected values are 'mention' and 'link'. */
      type: string;
      value: string;
    }
    interface ReplyRef {
      [Brand.Type]?: "app.bsky.feed.post#replyRef";
      parent: ComAtprotoRepoStrongRef.Main;
      root: ComAtprotoRepoStrongRef.Main;
    }
    /**
     * Deprecated. Use app.bsky.richtext instead -- A text segment. Start is inclusive, end is exclusive. Indices are for utf16-encoded strings.
     * @deprecated
     */
    interface TextSlice {
      [Brand.Type]?: "app.bsky.feed.post#textSlice";
      /** Minimum: 0 */
      end: number;
      /** Minimum: 0 */
      start: number;
    }
  }
  namespace AppBskyFeedPostgate {
    /** Record defining interaction rules for a post. The record key (rkey) of the postgate record must match the record key of the post, and that record must be in the same repository. */
    interface Record {
      $type: "app.bsky.feed.postgate";
      createdAt: string;
      /** Reference (AT-URI) to the post record. */
      post: At.Uri;
      /**
       * List of AT-URIs embedding this post that the author has detached from. \
       * Maximum array length: 50
       */
      detachedEmbeddingUris?: At.Uri[];
      /** Maximum array length: 5 */
      embeddingRules?: Brand.Union<DisableRule>[];
    }
    /** Disables embedding of this post. */
    interface DisableRule {
      [Brand.Type]?: "app.bsky.feed.postgate#disableRule";
    }
  }
  namespace AppBskyFeedRepost {
    /** Record representing a 'repost' of an existing Bluesky post. */
    interface Record {
      $type: "app.bsky.feed.repost";
      createdAt: string;
      subject: ComAtprotoRepoStrongRef.Main;
    }
  }
  /** Find posts matching search criteria, returning views of those posts. */
  namespace AppBskyFeedSearchPosts {
    interface Params {
      /** Search query string; syntax, phrase, boolean, and faceting is unspecified, but Lucene query syntax is recommended. */
      q: string;
      /** Filter to posts by the given account. Handles are resolved to DID before query-time. */
      author?: string;
      /** Optional pagination mechanism; may not necessarily allow scrolling through entire result set. */
      cursor?: string;
      /** Filter to posts with URLs (facet links or embeds) linking to the given domain (hostname). Server may apply hostname normalization. */
      domain?: string;
      /** Filter to posts in the given language. Expected to be based on post language field, though server may override language detection. */
      lang?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 25
       */
      limit?: number;
      /** Filter to posts which mention the given account. Handles are resolved to DID before query-time. Only matches rich-text facet mentions. */
      mentions?: string;
      /** Filter results for posts after the indicated datetime (inclusive). Expected to use 'sortAt' timestamp, which may not match 'createdAt'. Can be a datetime, or just an ISO date (YYYY-MM-DD). */
      since?: string;
      /**
       * Specifies the ranking order of results.
       * @default "latest"
       */
      sort?: "latest" | "top" | (string & {});
      /**
       * Filter to posts with the given tag (hashtag), based on rich-text facet or tag field. Do not include the hash (#) prefix. Multiple tags can be specified, with 'AND' matching. \
       * Maximum string length: 640 \
       * Maximum grapheme length: 64
       */
      tag?: string[];
      /** Filter results for posts before the indicated datetime (not inclusive). Expected to use 'sortAt' timestamp, which may not match 'createdAt'. Can be a datetime, or just an ISO date (YYY-MM-DD). */
      until?: string;
      /** Filter to posts with links (facet links or embeds) pointing to this URL. Server may apply URL normalization or fuzzy matching. */
      url?: string;
    }
    type Input = undefined;
    interface Output {
      posts: AppBskyFeedDefs.PostView[];
      cursor?: string;
      /** Count of search hits. Optional, may be rounded/truncated, and may not be possible to paginate through all hits. */
      hitsTotal?: number;
    }
    interface Errors {
      BadQueryString: {};
    }
  }
  /** Send information about interactions with feed items back to the feed generator that served them. */
  namespace AppBskyFeedSendInteractions {
    interface Params {}
    interface Input {
      interactions: AppBskyFeedDefs.Interaction[];
    }
    interface Output {}
  }
  namespace AppBskyFeedThreadgate {
    /** Record defining interaction gating rules for a thread (aka, reply controls). The record key (rkey) of the threadgate record must match the record key of the thread's root post, and that record must be in the same repository. */
    interface Record {
      $type: "app.bsky.feed.threadgate";
      createdAt: string;
      /** Reference (AT-URI) to the post record. */
      post: At.Uri;
      /** Maximum array length: 5 */
      allow?: Brand.Union<FollowingRule | ListRule | MentionRule>[];
      /**
       * List of hidden reply URIs. \
       * Maximum array length: 50
       */
      hiddenReplies?: At.Uri[];
    }
    /** Allow replies from actors you follow. */
    interface FollowingRule {
      [Brand.Type]?: "app.bsky.feed.threadgate#followingRule";
    }
    /** Allow replies from actors on a list. */
    interface ListRule {
      [Brand.Type]?: "app.bsky.feed.threadgate#listRule";
      list: At.Uri;
    }
    /** Allow replies from actors mentioned in your post. */
    interface MentionRule {
      [Brand.Type]?: "app.bsky.feed.threadgate#mentionRule";
    }
  }
  namespace AppBskyGraphBlock {
    /** Record declaring a 'block' relationship against another account. NOTE: blocks are public in Bluesky; see blog posts for details. */
    interface Record {
      $type: "app.bsky.graph.block";
      createdAt: string;
      /** DID of the account to be blocked. */
      subject: At.DID;
    }
  }
  namespace AppBskyGraphDefs {
    type Curatelist = "app.bsky.graph.defs#curatelist";
    interface ListItemView {
      [Brand.Type]?: "app.bsky.graph.defs#listItemView";
      subject: AppBskyActorDefs.ProfileView;
      uri: At.Uri;
    }
    type ListPurpose =
      | "app.bsky.graph.defs#curatelist"
      | "app.bsky.graph.defs#modlist"
      | "app.bsky.graph.defs#referencelist"
      | (string & {});
    interface ListView {
      [Brand.Type]?: "app.bsky.graph.defs#listView";
      cid: At.CID;
      creator: AppBskyActorDefs.ProfileView;
      indexedAt: string;
      /**
       * Minimum string length: 1 \
       * Maximum string length: 64
       */
      name: string;
      purpose: ListPurpose;
      uri: At.Uri;
      avatar?: string;
      /**
       * Maximum string length: 3000 \
       * Maximum grapheme length: 300
       */
      description?: string;
      descriptionFacets?: AppBskyRichtextFacet.Main[];
      labels?: ComAtprotoLabelDefs.Label[];
      /** Minimum: 0 */
      listItemCount?: number;
      viewer?: ListViewerState;
    }
    interface ListViewBasic {
      [Brand.Type]?: "app.bsky.graph.defs#listViewBasic";
      cid: At.CID;
      /**
       * Minimum string length: 1 \
       * Maximum string length: 64
       */
      name: string;
      purpose: ListPurpose;
      uri: At.Uri;
      avatar?: string;
      indexedAt?: string;
      labels?: ComAtprotoLabelDefs.Label[];
      /** Minimum: 0 */
      listItemCount?: number;
      viewer?: ListViewerState;
    }
    interface ListViewerState {
      [Brand.Type]?: "app.bsky.graph.defs#listViewerState";
      blocked?: At.Uri;
      muted?: boolean;
    }
    type Modlist = "app.bsky.graph.defs#modlist";
    /** indicates that a handle or DID could not be resolved */
    interface NotFoundActor {
      [Brand.Type]?: "app.bsky.graph.defs#notFoundActor";
      actor: string;
      notFound: boolean;
    }
    type Referencelist = "app.bsky.graph.defs#referencelist";
    /** lists the bi-directional graph relationships between one actor (not indicated in the object), and the target actors (the DID included in the object) */
    interface Relationship {
      [Brand.Type]?: "app.bsky.graph.defs#relationship";
      did: At.DID;
      /** if the actor is followed by this DID, contains the AT-URI of the follow record */
      followedBy?: At.Uri;
      /** if the actor follows this DID, this is the AT-URI of the follow record */
      following?: At.Uri;
    }
    interface StarterPackView {
      [Brand.Type]?: "app.bsky.graph.defs#starterPackView";
      cid: At.CID;
      creator: AppBskyActorDefs.ProfileViewBasic;
      indexedAt: string;
      record: unknown;
      uri: At.Uri;
      /** Maximum array length: 3 */
      feeds?: AppBskyFeedDefs.GeneratorView[];
      /** Minimum: 0 */
      joinedAllTimeCount?: number;
      /** Minimum: 0 */
      joinedWeekCount?: number;
      labels?: ComAtprotoLabelDefs.Label[];
      list?: ListViewBasic;
      /** Maximum array length: 12 */
      listItemsSample?: ListItemView[];
    }
    interface StarterPackViewBasic {
      [Brand.Type]?: "app.bsky.graph.defs#starterPackViewBasic";
      cid: At.CID;
      creator: AppBskyActorDefs.ProfileViewBasic;
      indexedAt: string;
      record: unknown;
      uri: At.Uri;
      /** Minimum: 0 */
      joinedAllTimeCount?: number;
      /** Minimum: 0 */
      joinedWeekCount?: number;
      labels?: ComAtprotoLabelDefs.Label[];
      /** Minimum: 0 */
      listItemCount?: number;
    }
  }
  namespace AppBskyGraphFollow {
    /** Record declaring a social 'follow' relationship of another account. Duplicate follows will be ignored by the AppView. */
    interface Record {
      $type: "app.bsky.graph.follow";
      createdAt: string;
      subject: At.DID;
    }
  }
  /** Get a list of starter packs created by the actor. */
  namespace AppBskyGraphGetActorStarterPacks {
    interface Params {
      actor: string;
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      starterPacks: AppBskyGraphDefs.StarterPackViewBasic[];
      cursor?: string;
    }
  }
  /** Enumerates which accounts the requesting account is currently blocking. Requires auth. */
  namespace AppBskyGraphGetBlocks {
    interface Params {
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      blocks: AppBskyActorDefs.ProfileView[];
      cursor?: string;
    }
  }
  /** Enumerates accounts which follow a specified account (actor). */
  namespace AppBskyGraphGetFollowers {
    interface Params {
      actor: string;
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      followers: AppBskyActorDefs.ProfileView[];
      subject: AppBskyActorDefs.ProfileView;
      cursor?: string;
    }
  }
  /** Enumerates accounts which a specified account (actor) follows. */
  namespace AppBskyGraphGetFollows {
    interface Params {
      actor: string;
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      follows: AppBskyActorDefs.ProfileView[];
      subject: AppBskyActorDefs.ProfileView;
      cursor?: string;
    }
  }
  /** Enumerates accounts which follow a specified account (actor) and are followed by the viewer. */
  namespace AppBskyGraphGetKnownFollowers {
    interface Params {
      actor: string;
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      followers: AppBskyActorDefs.ProfileView[];
      subject: AppBskyActorDefs.ProfileView;
      cursor?: string;
    }
  }
  /** Gets a 'view' (with additional context) of a specified list. */
  namespace AppBskyGraphGetList {
    interface Params {
      /** Reference (AT-URI) of the list record to hydrate. */
      list: At.Uri;
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      items: AppBskyGraphDefs.ListItemView[];
      list: AppBskyGraphDefs.ListView;
      cursor?: string;
    }
  }
  /** Get mod lists that the requesting account (actor) is blocking. Requires auth. */
  namespace AppBskyGraphGetListBlocks {
    interface Params {
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      lists: AppBskyGraphDefs.ListView[];
      cursor?: string;
    }
  }
  /** Enumerates mod lists that the requesting account (actor) currently has muted. Requires auth. */
  namespace AppBskyGraphGetListMutes {
    interface Params {
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      lists: AppBskyGraphDefs.ListView[];
      cursor?: string;
    }
  }
  /** Enumerates the lists created by a specified account (actor). */
  namespace AppBskyGraphGetLists {
    interface Params {
      /** The account (actor) to enumerate lists from. */
      actor: string;
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      lists: AppBskyGraphDefs.ListView[];
      cursor?: string;
    }
  }
  /** Enumerates accounts that the requesting account (actor) currently has muted. Requires auth. */
  namespace AppBskyGraphGetMutes {
    interface Params {
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      mutes: AppBskyActorDefs.ProfileView[];
      cursor?: string;
    }
  }
  /** Enumerates public relationships between one account, and a list of other accounts. Does not require auth. */
  namespace AppBskyGraphGetRelationships {
    interface Params {
      /** Primary account requesting relationships for. */
      actor: string;
      /**
       * List of 'other' accounts to be related back to the primary. \
       * Maximum array length: 30
       */
      others?: string[];
    }
    type Input = undefined;
    interface Output {
      relationships: Brand.Union<
        AppBskyGraphDefs.NotFoundActor | AppBskyGraphDefs.Relationship
      >[];
      actor?: At.DID;
    }
    interface Errors {
      ActorNotFound: {};
    }
  }
  /** Gets a view of a starter pack. */
  namespace AppBskyGraphGetStarterPack {
    interface Params {
      /** Reference (AT-URI) of the starter pack record. */
      starterPack: At.Uri;
    }
    type Input = undefined;
    interface Output {
      starterPack: AppBskyGraphDefs.StarterPackView;
    }
  }
  /** Get views for a list of starter packs. */
  namespace AppBskyGraphGetStarterPacks {
    interface Params {
      /** Maximum array length: 25 */
      uris: At.Uri[];
    }
    type Input = undefined;
    interface Output {
      starterPacks: AppBskyGraphDefs.StarterPackViewBasic[];
    }
  }
  /** Enumerates follows similar to a given account (actor). Expected use is to recommend additional accounts immediately after following one account. */
  namespace AppBskyGraphGetSuggestedFollowsByActor {
    interface Params {
      actor: string;
    }
    type Input = undefined;
    interface Output {
      suggestions: AppBskyActorDefs.ProfileView[];
      /**
       * If true, response has fallen-back to generic results, and is not scoped using relativeToDid
       * @default false
       */
      isFallback?: boolean;
    }
  }
  namespace AppBskyGraphList {
    /** Record representing a list of accounts (actors). Scope includes both moderation-oriented lists and curration-oriented lists. */
    interface Record {
      $type: "app.bsky.graph.list";
      createdAt: string;
      /**
       * Display name for list; can not be empty. \
       * Minimum string length: 1 \
       * Maximum string length: 64
       */
      name: string;
      /** Defines the purpose of the list (aka, moderation-oriented or curration-oriented) */
      purpose: AppBskyGraphDefs.ListPurpose;
      avatar?: At.Blob;
      /**
       * Maximum string length: 3000 \
       * Maximum grapheme length: 300
       */
      description?: string;
      descriptionFacets?: AppBskyRichtextFacet.Main[];
      labels?: Brand.Union<ComAtprotoLabelDefs.SelfLabels>;
    }
  }
  namespace AppBskyGraphListblock {
    /** Record representing a block relationship against an entire an entire list of accounts (actors). */
    interface Record {
      $type: "app.bsky.graph.listblock";
      createdAt: string;
      /** Reference (AT-URI) to the mod list record. */
      subject: At.Uri;
    }
  }
  namespace AppBskyGraphListitem {
    /** Record representing an account's inclusion on a specific list. The AppView will ignore duplicate listitem records. */
    interface Record {
      $type: "app.bsky.graph.listitem";
      createdAt: string;
      /** Reference (AT-URI) to the list record (app.bsky.graph.list). */
      list: At.Uri;
      /** The account which is included on the list. */
      subject: At.DID;
    }
  }
  /** Creates a mute relationship for the specified account. Mutes are private in Bluesky. Requires auth. */
  namespace AppBskyGraphMuteActor {
    interface Params {}
    interface Input {
      actor: string;
    }
    type Output = undefined;
  }
  /** Creates a mute relationship for the specified list of accounts. Mutes are private in Bluesky. Requires auth. */
  namespace AppBskyGraphMuteActorList {
    interface Params {}
    interface Input {
      list: At.Uri;
    }
    type Output = undefined;
  }
  /** Mutes a thread preventing notifications from the thread and any of its children. Mutes are private in Bluesky. Requires auth. */
  namespace AppBskyGraphMuteThread {
    interface Params {}
    interface Input {
      root: At.Uri;
    }
    type Output = undefined;
  }
  namespace AppBskyGraphStarterpack {
    /** Record defining a starter pack of actors and feeds for new users. */
    interface Record {
      $type: "app.bsky.graph.starterpack";
      createdAt: string;
      /** Reference (AT-URI) to the list record. */
      list: At.Uri;
      /**
       * Display name for starter pack; can not be empty. \
       * Minimum string length: 1 \
       * Maximum string length: 500 \
       * Maximum grapheme length: 50
       */
      name: string;
      /**
       * Maximum string length: 3000 \
       * Maximum grapheme length: 300
       */
      description?: string;
      descriptionFacets?: AppBskyRichtextFacet.Main[];
      /** Maximum array length: 3 */
      feeds?: FeedItem[];
    }
    interface FeedItem {
      [Brand.Type]?: "app.bsky.graph.starterpack#feedItem";
      uri: At.Uri;
    }
  }
  /** Unmutes the specified account. Requires auth. */
  namespace AppBskyGraphUnmuteActor {
    interface Params {}
    interface Input {
      actor: string;
    }
    type Output = undefined;
  }
  /** Unmutes the specified list of accounts. Requires auth. */
  namespace AppBskyGraphUnmuteActorList {
    interface Params {}
    interface Input {
      list: At.Uri;
    }
    type Output = undefined;
  }
  /** Unmutes the specified thread. Requires auth. */
  namespace AppBskyGraphUnmuteThread {
    interface Params {}
    interface Input {
      root: At.Uri;
    }
    type Output = undefined;
  }
  namespace AppBskyLabelerDefs {
    interface LabelerPolicies {
      [Brand.Type]?: "app.bsky.labeler.defs#labelerPolicies";
      /** The label values which this labeler publishes. May include global or custom labels. */
      labelValues: ComAtprotoLabelDefs.LabelValue[];
      /** Label values created by this labeler and scoped exclusively to it. Labels defined here will override global label definitions for this labeler. */
      labelValueDefinitions?: ComAtprotoLabelDefs.LabelValueDefinition[];
    }
    interface LabelerView {
      [Brand.Type]?: "app.bsky.labeler.defs#labelerView";
      cid: At.CID;
      creator: AppBskyActorDefs.ProfileView;
      indexedAt: string;
      uri: At.Uri;
      labels?: ComAtprotoLabelDefs.Label[];
      /** Minimum: 0 */
      likeCount?: number;
      viewer?: LabelerViewerState;
    }
    interface LabelerViewDetailed {
      [Brand.Type]?: "app.bsky.labeler.defs#labelerViewDetailed";
      cid: At.CID;
      creator: AppBskyActorDefs.ProfileView;
      indexedAt: string;
      policies: AppBskyLabelerDefs.LabelerPolicies;
      uri: At.Uri;
      labels?: ComAtprotoLabelDefs.Label[];
      /** Minimum: 0 */
      likeCount?: number;
      viewer?: LabelerViewerState;
    }
    interface LabelerViewerState {
      [Brand.Type]?: "app.bsky.labeler.defs#labelerViewerState";
      like?: At.Uri;
    }
  }
  /** Get information about a list of labeler services. */
  namespace AppBskyLabelerGetServices {
    interface Params {
      dids: At.DID[];
      /** @default false */
      detailed?: boolean;
    }
    type Input = undefined;
    interface Output {
      views: Brand.Union<
        AppBskyLabelerDefs.LabelerView | AppBskyLabelerDefs.LabelerViewDetailed
      >[];
    }
  }
  namespace AppBskyLabelerService {
    /** A declaration of the existence of labeler service. */
    interface Record {
      $type: "app.bsky.labeler.service";
      createdAt: string;
      policies: AppBskyLabelerDefs.LabelerPolicies;
      labels?: Brand.Union<ComAtprotoLabelDefs.SelfLabels>;
    }
  }
  /** Count the number of unread notifications for the requesting account. Requires auth. */
  namespace AppBskyNotificationGetUnreadCount {
    interface Params {
      priority?: boolean;
      seenAt?: string;
    }
    type Input = undefined;
    interface Output {
      count: number;
    }
  }
  /** Enumerate notifications for the requesting account. Requires auth. */
  namespace AppBskyNotificationListNotifications {
    interface Params {
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
      priority?: boolean;
      seenAt?: string;
    }
    type Input = undefined;
    interface Output {
      notifications: Notification[];
      cursor?: string;
      priority?: boolean;
      seenAt?: string;
    }
    interface Notification {
      [Brand.Type]?: "app.bsky.notification.listNotifications#notification";
      author: AppBskyActorDefs.ProfileView;
      cid: At.CID;
      indexedAt: string;
      isRead: boolean;
      /** Expected values are 'like', 'repost', 'follow', 'mention', 'reply', 'quote', and 'starterpack-joined'. */
      reason:
        | "follow"
        | "like"
        | "mention"
        | "quote"
        | "reply"
        | "repost"
        | "starterpack-joined"
        | (string & {});
      record: unknown;
      uri: At.Uri;
      labels?: ComAtprotoLabelDefs.Label[];
      reasonSubject?: At.Uri;
    }
  }
  /** Set notification-related preferences for an account. Requires auth. */
  namespace AppBskyNotificationPutPreferences {
    interface Params {}
    interface Input {
      priority: boolean;
    }
    type Output = undefined;
  }
  /** Register to receive push notifications, via a specified service, for the requesting account. Requires auth. */
  namespace AppBskyNotificationRegisterPush {
    interface Params {}
    interface Input {
      appId: string;
      platform: "android" | "ios" | "web" | (string & {});
      serviceDid: At.DID;
      token: string;
    }
    type Output = undefined;
  }
  /** Notify server that the requesting account has seen notifications. Requires auth. */
  namespace AppBskyNotificationUpdateSeen {
    interface Params {}
    interface Input {
      seenAt: string;
    }
    type Output = undefined;
  }
  namespace AppBskyRichtextFacet {
    /** Annotation of a sub-string within rich text. */
    interface Main {
      [Brand.Type]?: "app.bsky.richtext.facet";
      features: Brand.Union<Link | Mention | Tag>[];
      index: ByteSlice;
    }
    /** Specifies the sub-string range a facet feature applies to. Start index is inclusive, end index is exclusive. Indices are zero-indexed, counting bytes of the UTF-8 encoded text. NOTE: some languages, like Javascript, use UTF-16 or Unicode codepoints for string slice indexing; in these languages, convert to byte arrays before working with facets. */
    interface ByteSlice {
      [Brand.Type]?: "app.bsky.richtext.facet#byteSlice";
      /** Minimum: 0 */
      byteEnd: number;
      /** Minimum: 0 */
      byteStart: number;
    }
    /** Facet feature for a URL. The text URL may have been simplified or truncated, but the facet reference should be a complete URL. */
    interface Link {
      [Brand.Type]?: "app.bsky.richtext.facet#link";
      uri: string;
    }
    /** Facet feature for mention of another account. The text is usually a handle, including a '@' prefix, but the facet reference is a DID. */
    interface Mention {
      [Brand.Type]?: "app.bsky.richtext.facet#mention";
      did: At.DID;
    }
    /** Facet feature for a hashtag. The text usually includes a '#' prefix, but the facet reference should not (except in the case of 'double hash tags'). */
    interface Tag {
      [Brand.Type]?: "app.bsky.richtext.facet#tag";
      /**
       * Maximum string length: 640 \
       * Maximum grapheme length: 64
       */
      tag: string;
    }
  }
  namespace AppBskyUnspeccedDefs {
    interface SkeletonSearchActor {
      [Brand.Type]?: "app.bsky.unspecced.defs#skeletonSearchActor";
      did: At.DID;
    }
    interface SkeletonSearchPost {
      [Brand.Type]?: "app.bsky.unspecced.defs#skeletonSearchPost";
      uri: At.Uri;
    }
  }
  /** An unspecced view of globally popular feed generators. */
  namespace AppBskyUnspeccedGetPopularFeedGenerators {
    interface Params {
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
      query?: string;
    }
    type Input = undefined;
    interface Output {
      feeds: AppBskyFeedDefs.GeneratorView[];
      cursor?: string;
    }
  }
  /** Get a skeleton of suggested actors. Intended to be called and then hydrated through app.bsky.actor.getSuggestions */
  namespace AppBskyUnspeccedGetSuggestionsSkeleton {
    interface Params {
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
      /** DID of the account to get suggestions relative to. If not provided, suggestions will be based on the viewer. */
      relativeToDid?: At.DID;
      /** DID of the account making the request (not included for public/unauthenticated queries). Used to boost followed accounts in ranking. */
      viewer?: At.DID;
    }
    type Input = undefined;
    interface Output {
      actors: AppBskyUnspeccedDefs.SkeletonSearchActor[];
      cursor?: string;
      /** DID of the account these suggestions are relative to. If this is returned undefined, suggestions are based on the viewer. */
      relativeToDid?: At.DID;
    }
  }
  /** Get a list of suggestions (feeds and users) tagged with categories */
  namespace AppBskyUnspeccedGetTaggedSuggestions {
    type Input = undefined;
    interface Output {
      suggestions: Suggestion[];
    }
    interface Suggestion {
      [Brand.Type]?: "app.bsky.unspecced.getTaggedSuggestions#suggestion";
      subject: string;
      subjectType: "actor" | "feed" | (string & {});
      tag: string;
    }
  }
  /** Backend Actors (profile) search, returns only skeleton. */
  namespace AppBskyUnspeccedSearchActorsSkeleton {
    interface Params {
      /** Search query string; syntax, phrase, boolean, and faceting is unspecified, but Lucene query syntax is recommended. For typeahead search, only simple term match is supported, not full syntax. */
      q: string;
      /** Optional pagination mechanism; may not necessarily allow scrolling through entire result set. */
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 25
       */
      limit?: number;
      /** If true, acts as fast/simple 'typeahead' query. */
      typeahead?: boolean;
      /** DID of the account making the request (not included for public/unauthenticated queries). Used to boost followed accounts in ranking. */
      viewer?: At.DID;
    }
    type Input = undefined;
    interface Output {
      actors: AppBskyUnspeccedDefs.SkeletonSearchActor[];
      cursor?: string;
      /** Count of search hits. Optional, may be rounded/truncated, and may not be possible to paginate through all hits. */
      hitsTotal?: number;
    }
    interface Errors {
      BadQueryString: {};
    }
  }
  /** Backend Posts search, returns only skeleton */
  namespace AppBskyUnspeccedSearchPostsSkeleton {
    interface Params {
      /** Search query string; syntax, phrase, boolean, and faceting is unspecified, but Lucene query syntax is recommended. */
      q: string;
      /** Filter to posts by the given account. Handles are resolved to DID before query-time. */
      author?: string;
      /** Optional pagination mechanism; may not necessarily allow scrolling through entire result set. */
      cursor?: string;
      /** Filter to posts with URLs (facet links or embeds) linking to the given domain (hostname). Server may apply hostname normalization. */
      domain?: string;
      /** Filter to posts in the given language. Expected to be based on post language field, though server may override language detection. */
      lang?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 25
       */
      limit?: number;
      /** Filter to posts which mention the given account. Handles are resolved to DID before query-time. Only matches rich-text facet mentions. */
      mentions?: string;
      /** Filter results for posts after the indicated datetime (inclusive). Expected to use 'sortAt' timestamp, which may not match 'createdAt'. Can be a datetime, or just an ISO date (YYYY-MM-DD). */
      since?: string;
      /**
       * Specifies the ranking order of results.
       * @default "latest"
       */
      sort?: "latest" | "top" | (string & {});
      /**
       * Filter to posts with the given tag (hashtag), based on rich-text facet or tag field. Do not include the hash (#) prefix. Multiple tags can be specified, with 'AND' matching. \
       * Maximum string length: 640 \
       * Maximum grapheme length: 64
       */
      tag?: string[];
      /** Filter results for posts before the indicated datetime (not inclusive). Expected to use 'sortAt' timestamp, which may not match 'createdAt'. Can be a datetime, or just an ISO date (YYY-MM-DD). */
      until?: string;
      /** Filter to posts with links (facet links or embeds) pointing to this URL. Server may apply URL normalization or fuzzy matching. */
      url?: string;
      /** DID of the account making the request (not included for public/unauthenticated queries). Used for 'from:me' queries. */
      viewer?: At.DID;
    }
    type Input = undefined;
    interface Output {
      posts: AppBskyUnspeccedDefs.SkeletonSearchPost[];
      cursor?: string;
      /** Count of search hits. Optional, may be rounded/truncated, and may not be possible to paginate through all hits. */
      hitsTotal?: number;
    }
    interface Errors {
      BadQueryString: {};
    }
  }
  namespace AppBskyVideoDefs {
    interface JobStatus {
      [Brand.Type]?: "app.bsky.video.defs#jobStatus";
      did: At.DID;
      jobId: string;
      /** The state of the video processing job. All values not listed as a known value indicate that the job is in process. */
      state: "JOB_STATE_COMPLETED" | "JOB_STATE_FAILED" | (string & {});
      blob?: At.Blob;
      error?: string;
      message?: string;
      /**
       * Progress within the current processing state. \
       * Minimum: 0 \
       * Maximum: 100
       */
      progress?: number;
    }
  }
  /** Get status details for a video processing job. */
  namespace AppBskyVideoGetJobStatus {
    interface Params {
      jobId: string;
    }
    type Input = undefined;
    interface Output {
      jobStatus: AppBskyVideoDefs.JobStatus;
    }
  }
  /** Get video upload limits for the authenticated user. */
  namespace AppBskyVideoGetUploadLimits {
    interface Params {}
    type Input = undefined;
    interface Output {
      canUpload: boolean;
      error?: string;
      message?: string;
      remainingDailyBytes?: number;
      remainingDailyVideos?: number;
    }
  }
  /** Upload a video to be processed then stored on the PDS. */
  namespace AppBskyVideoUploadVideo {
    interface Params {}
    type Input = Blob | ArrayBufferView;
    interface Output {
      jobStatus: AppBskyVideoDefs.JobStatus;
    }
  }
  namespace ChatBskyActorDeclaration {
    /** A declaration of a Bluesky chat account. */
    interface Record {
      $type: "chat.bsky.actor.declaration";
      allowIncoming: "all" | "following" | "none" | (string & {});
    }
  }
  namespace ChatBskyActorDefs {
    interface ProfileViewBasic {
      [Brand.Type]?: "chat.bsky.actor.defs#profileViewBasic";
      did: At.DID;
      handle: At.Handle;
      associated?: AppBskyActorDefs.ProfileAssociated;
      avatar?: string;
      /** Set to true when the actor cannot actively participate in converations */
      chatDisabled?: boolean;
      /**
       * Maximum string length: 640 \
       * Maximum grapheme length: 64
       */
      displayName?: string;
      labels?: ComAtprotoLabelDefs.Label[];
      viewer?: AppBskyActorDefs.ViewerState;
    }
  }
  namespace ChatBskyActorDeleteAccount {
    interface Params {}
    type Input = undefined;
    interface Output {}
  }
  namespace ChatBskyActorExportAccountData {
    interface Params {}
    type Input = undefined;
    type Output = Uint8Array;
  }
  namespace ChatBskyConvoDefs {
    interface ConvoView {
      [Brand.Type]?: "chat.bsky.convo.defs#convoView";
      id: string;
      members: ChatBskyActorDefs.ProfileViewBasic[];
      muted: boolean;
      rev: string;
      unreadCount: number;
      lastMessage?: Brand.Union<DeletedMessageView | MessageView>;
    }
    interface DeletedMessageView {
      [Brand.Type]?: "chat.bsky.convo.defs#deletedMessageView";
      id: string;
      rev: string;
      sender: MessageViewSender;
      sentAt: string;
    }
    interface LogBeginConvo {
      [Brand.Type]?: "chat.bsky.convo.defs#logBeginConvo";
      convoId: string;
      rev: string;
    }
    interface LogCreateMessage {
      [Brand.Type]?: "chat.bsky.convo.defs#logCreateMessage";
      convoId: string;
      message: Brand.Union<DeletedMessageView | MessageView>;
      rev: string;
    }
    interface LogDeleteMessage {
      [Brand.Type]?: "chat.bsky.convo.defs#logDeleteMessage";
      convoId: string;
      message: Brand.Union<DeletedMessageView | MessageView>;
      rev: string;
    }
    interface LogLeaveConvo {
      [Brand.Type]?: "chat.bsky.convo.defs#logLeaveConvo";
      convoId: string;
      rev: string;
    }
    interface MessageInput {
      [Brand.Type]?: "chat.bsky.convo.defs#messageInput";
      /**
       * Maximum string length: 10000 \
       * Maximum grapheme length: 1000
       */
      text: string;
      embed?: Brand.Union<AppBskyEmbedRecord.Main>;
      /** Annotations of text (mentions, URLs, hashtags, etc) */
      facets?: AppBskyRichtextFacet.Main[];
    }
    interface MessageRef {
      [Brand.Type]?: "chat.bsky.convo.defs#messageRef";
      convoId: string;
      did: At.DID;
      messageId: string;
    }
    interface MessageView {
      [Brand.Type]?: "chat.bsky.convo.defs#messageView";
      id: string;
      rev: string;
      sender: MessageViewSender;
      sentAt: string;
      /**
       * Maximum string length: 10000 \
       * Maximum grapheme length: 1000
       */
      text: string;
      embed?: Brand.Union<AppBskyEmbedRecord.View>;
      /** Annotations of text (mentions, URLs, hashtags, etc) */
      facets?: AppBskyRichtextFacet.Main[];
    }
    interface MessageViewSender {
      [Brand.Type]?: "chat.bsky.convo.defs#messageViewSender";
      did: At.DID;
    }
  }
  namespace ChatBskyConvoDeleteMessageForSelf {
    interface Params {}
    interface Input {
      convoId: string;
      messageId: string;
    }
    type Output = ChatBskyConvoDefs.DeletedMessageView;
  }
  namespace ChatBskyConvoGetConvo {
    interface Params {
      convoId: string;
    }
    type Input = undefined;
    interface Output {
      convo: ChatBskyConvoDefs.ConvoView;
    }
  }
  namespace ChatBskyConvoGetConvoForMembers {
    interface Params {
      /**
       * Minimum array length: 1 \
       * Maximum array length: 10
       */
      members: At.DID[];
    }
    type Input = undefined;
    interface Output {
      convo: ChatBskyConvoDefs.ConvoView;
    }
  }
  namespace ChatBskyConvoGetLog {
    interface Params {
      cursor?: string;
    }
    type Input = undefined;
    interface Output {
      logs: Brand.Union<
        | ChatBskyConvoDefs.LogBeginConvo
        | ChatBskyConvoDefs.LogCreateMessage
        | ChatBskyConvoDefs.LogDeleteMessage
        | ChatBskyConvoDefs.LogLeaveConvo
      >[];
      cursor?: string;
    }
  }
  namespace ChatBskyConvoGetMessages {
    interface Params {
      convoId: string;
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      messages: Brand.Union<
        ChatBskyConvoDefs.DeletedMessageView | ChatBskyConvoDefs.MessageView
      >[];
      cursor?: string;
    }
  }
  namespace ChatBskyConvoLeaveConvo {
    interface Params {}
    interface Input {
      convoId: string;
    }
    interface Output {
      convoId: string;
      rev: string;
    }
  }
  namespace ChatBskyConvoListConvos {
    interface Params {
      cursor?: string;
      /**
       * Minimum: 1 \
       * Maximum: 100
       * @default 50
       */
      limit?: number;
    }
    type Input = undefined;
    interface Output {
      convos: ChatBskyConvoDefs.ConvoView[];
      cursor?: string;
    }
  }
  namespace ChatBskyConvoMuteConvo {
    interface Params {}
    interface Input {
      convoId: string;
    }
    interface Output {
      convo: ChatBskyConvoDefs.ConvoView;
    }
  }
  namespace ChatBskyConvoSendMessage {
    interface Params {}
    interface Input {
      convoId: string;
      message: ChatBskyConvoDefs.MessageInput;
    }
    type Output = ChatBskyConvoDefs.MessageView;
  }
  namespace ChatBskyConvoSendMessageBatch {
    interface Params {}
    interface Input {
      /** Maximum array length: 100 */
      items: BatchItem[];
    }
    interface Output {
      items: ChatBskyConvoDefs.MessageView[];
    }
    interface BatchItem {
      [Brand.Type]?: "chat.bsky.convo.sendMessageBatch#batchItem";
      convoId: string;
      message: ChatBskyConvoDefs.MessageInput;
    }
  }
  namespace ChatBskyConvoUnmuteConvo {
    interface Params {}
    interface Input {
      convoId: string;
    }
    interface Output {
      convo: ChatBskyConvoDefs.ConvoView;
    }
  }
  namespace ChatBskyConvoUpdateRead {
    interface Params {}
    interface Input {
      convoId: string;
      messageId?: string;
    }
    interface Output {
      convo: ChatBskyConvoDefs.ConvoView;
    }
  }
  namespace ChatBskyModerationGetActorMetadata {
    interface Params {
      actor: At.DID;
    }
    type Input = undefined;
    interface Output {
      all: Metadata;
      day: Metadata;
      month: Metadata;
    }
    interface Metadata {
      [Brand.Type]?: "chat.bsky.moderation.getActorMetadata#metadata";
      convos: number;
      convosStarted: number;
      messagesReceived: number;
      messagesSent: number;
    }
  }
  namespace ChatBskyModerationGetMessageContext {
    interface Params {
      messageId: string;
      /** @default 5 */
      after?: number;
      /** @default 5 */
      before?: number;
      /** Conversation that the message is from. NOTE: this field will eventually be required. */
      convoId?: string;
    }
    type Input = undefined;
    interface Output {
      messages: Brand.Union<
        ChatBskyConvoDefs.DeletedMessageView | ChatBskyConvoDefs.MessageView
      >[];
    }
  }
  namespace ChatBskyModerationUpdateActorAccess {
    interface Params {}
    interface Input {
      actor: At.DID;
      allowAccess: boolean;
      ref?: string;
    }
    type Output = undefined;
  }
  interface Records {
    "app.bsky.actor.profile": AppBskyActorProfile.Record;
    "app.bsky.feed.generator": AppBskyFeedGenerator.Record;
    "app.bsky.feed.like": AppBskyFeedLike.Record;
    "app.bsky.feed.post": AppBskyFeedPost.Record;
    "app.bsky.feed.postgate": AppBskyFeedPostgate.Record;
    "app.bsky.feed.repost": AppBskyFeedRepost.Record;
    "app.bsky.feed.threadgate": AppBskyFeedThreadgate.Record;
    "app.bsky.graph.block": AppBskyGraphBlock.Record;
    "app.bsky.graph.follow": AppBskyGraphFollow.Record;
    "app.bsky.graph.list": AppBskyGraphList.Record;
    "app.bsky.graph.listblock": AppBskyGraphListblock.Record;
    "app.bsky.graph.listitem": AppBskyGraphListitem.Record;
    "app.bsky.graph.starterpack": AppBskyGraphStarterpack.Record;
    "app.bsky.labeler.service": AppBskyLabelerService.Record;
    "chat.bsky.actor.declaration": ChatBskyActorDeclaration.Record;
  }
  interface Queries {
    "app.bsky.actor.getPreferences": {
      output: AppBskyActorGetPreferences.Output;
    };
    "app.bsky.actor.getProfile": {
      params: AppBskyActorGetProfile.Params;
      output: AppBskyActorGetProfile.Output;
    };
    "app.bsky.actor.getProfiles": {
      params: AppBskyActorGetProfiles.Params;
      output: AppBskyActorGetProfiles.Output;
    };
    "app.bsky.actor.getSuggestions": {
      params: AppBskyActorGetSuggestions.Params;
      output: AppBskyActorGetSuggestions.Output;
    };
    "app.bsky.actor.searchActors": {
      params: AppBskyActorSearchActors.Params;
      output: AppBskyActorSearchActors.Output;
    };
    "app.bsky.actor.searchActorsTypeahead": {
      params: AppBskyActorSearchActorsTypeahead.Params;
      output: AppBskyActorSearchActorsTypeahead.Output;
    };
    "app.bsky.feed.describeFeedGenerator": {
      output: AppBskyFeedDescribeFeedGenerator.Output;
    };
    "app.bsky.feed.getActorFeeds": {
      params: AppBskyFeedGetActorFeeds.Params;
      output: AppBskyFeedGetActorFeeds.Output;
    };
    "app.bsky.feed.getActorLikes": {
      params: AppBskyFeedGetActorLikes.Params;
      output: AppBskyFeedGetActorLikes.Output;
    };
    "app.bsky.feed.getAuthorFeed": {
      params: AppBskyFeedGetAuthorFeed.Params;
      output: AppBskyFeedGetAuthorFeed.Output;
    };
    "app.bsky.feed.getFeed": {
      params: AppBskyFeedGetFeed.Params;
      output: AppBskyFeedGetFeed.Output;
    };
    "app.bsky.feed.getFeedGenerator": {
      params: AppBskyFeedGetFeedGenerator.Params;
      output: AppBskyFeedGetFeedGenerator.Output;
    };
    "app.bsky.feed.getFeedGenerators": {
      params: AppBskyFeedGetFeedGenerators.Params;
      output: AppBskyFeedGetFeedGenerators.Output;
    };
    "app.bsky.feed.getFeedSkeleton": {
      params: AppBskyFeedGetFeedSkeleton.Params;
      output: AppBskyFeedGetFeedSkeleton.Output;
    };
    "app.bsky.feed.getLikes": {
      params: AppBskyFeedGetLikes.Params;
      output: AppBskyFeedGetLikes.Output;
    };
    "app.bsky.feed.getListFeed": {
      params: AppBskyFeedGetListFeed.Params;
      output: AppBskyFeedGetListFeed.Output;
    };
    "app.bsky.feed.getPosts": {
      params: AppBskyFeedGetPosts.Params;
      output: AppBskyFeedGetPosts.Output;
    };
    "app.bsky.feed.getPostThread": {
      params: AppBskyFeedGetPostThread.Params;
      output: AppBskyFeedGetPostThread.Output;
    };
    "app.bsky.feed.getQuotes": {
      params: AppBskyFeedGetQuotes.Params;
      output: AppBskyFeedGetQuotes.Output;
    };
    "app.bsky.feed.getRepostedBy": {
      params: AppBskyFeedGetRepostedBy.Params;
      output: AppBskyFeedGetRepostedBy.Output;
    };
    "app.bsky.feed.getSuggestedFeeds": {
      params: AppBskyFeedGetSuggestedFeeds.Params;
      output: AppBskyFeedGetSuggestedFeeds.Output;
    };
    "app.bsky.feed.getTimeline": {
      params: AppBskyFeedGetTimeline.Params;
      output: AppBskyFeedGetTimeline.Output;
    };
    "app.bsky.feed.searchPosts": {
      params: AppBskyFeedSearchPosts.Params;
      output: AppBskyFeedSearchPosts.Output;
    };
    "app.bsky.graph.getActorStarterPacks": {
      params: AppBskyGraphGetActorStarterPacks.Params;
      output: AppBskyGraphGetActorStarterPacks.Output;
    };
    "app.bsky.graph.getBlocks": {
      params: AppBskyGraphGetBlocks.Params;
      output: AppBskyGraphGetBlocks.Output;
    };
    "app.bsky.graph.getFollowers": {
      params: AppBskyGraphGetFollowers.Params;
      output: AppBskyGraphGetFollowers.Output;
    };
    "app.bsky.graph.getFollows": {
      params: AppBskyGraphGetFollows.Params;
      output: AppBskyGraphGetFollows.Output;
    };
    "app.bsky.graph.getKnownFollowers": {
      params: AppBskyGraphGetKnownFollowers.Params;
      output: AppBskyGraphGetKnownFollowers.Output;
    };
    "app.bsky.graph.getList": {
      params: AppBskyGraphGetList.Params;
      output: AppBskyGraphGetList.Output;
    };
    "app.bsky.graph.getListBlocks": {
      params: AppBskyGraphGetListBlocks.Params;
      output: AppBskyGraphGetListBlocks.Output;
    };
    "app.bsky.graph.getListMutes": {
      params: AppBskyGraphGetListMutes.Params;
      output: AppBskyGraphGetListMutes.Output;
    };
    "app.bsky.graph.getLists": {
      params: AppBskyGraphGetLists.Params;
      output: AppBskyGraphGetLists.Output;
    };
    "app.bsky.graph.getMutes": {
      params: AppBskyGraphGetMutes.Params;
      output: AppBskyGraphGetMutes.Output;
    };
    "app.bsky.graph.getRelationships": {
      params: AppBskyGraphGetRelationships.Params;
      output: AppBskyGraphGetRelationships.Output;
    };
    "app.bsky.graph.getStarterPack": {
      params: AppBskyGraphGetStarterPack.Params;
      output: AppBskyGraphGetStarterPack.Output;
    };
    "app.bsky.graph.getStarterPacks": {
      params: AppBskyGraphGetStarterPacks.Params;
      output: AppBskyGraphGetStarterPacks.Output;
    };
    "app.bsky.graph.getSuggestedFollowsByActor": {
      params: AppBskyGraphGetSuggestedFollowsByActor.Params;
      output: AppBskyGraphGetSuggestedFollowsByActor.Output;
    };
    "app.bsky.labeler.getServices": {
      params: AppBskyLabelerGetServices.Params;
      output: AppBskyLabelerGetServices.Output;
    };
    "app.bsky.notification.getUnreadCount": {
      params: AppBskyNotificationGetUnreadCount.Params;
      output: AppBskyNotificationGetUnreadCount.Output;
    };
    "app.bsky.notification.listNotifications": {
      params: AppBskyNotificationListNotifications.Params;
      output: AppBskyNotificationListNotifications.Output;
    };
    "app.bsky.unspecced.getPopularFeedGenerators": {
      params: AppBskyUnspeccedGetPopularFeedGenerators.Params;
      output: AppBskyUnspeccedGetPopularFeedGenerators.Output;
    };
    "app.bsky.unspecced.getSuggestionsSkeleton": {
      params: AppBskyUnspeccedGetSuggestionsSkeleton.Params;
      output: AppBskyUnspeccedGetSuggestionsSkeleton.Output;
    };
    "app.bsky.unspecced.getTaggedSuggestions": {
      output: AppBskyUnspeccedGetTaggedSuggestions.Output;
    };
    "app.bsky.unspecced.searchActorsSkeleton": {
      params: AppBskyUnspeccedSearchActorsSkeleton.Params;
      output: AppBskyUnspeccedSearchActorsSkeleton.Output;
    };
    "app.bsky.unspecced.searchPostsSkeleton": {
      params: AppBskyUnspeccedSearchPostsSkeleton.Params;
      output: AppBskyUnspeccedSearchPostsSkeleton.Output;
    };
    "app.bsky.video.getJobStatus": {
      params: AppBskyVideoGetJobStatus.Params;
      output: AppBskyVideoGetJobStatus.Output;
    };
    "app.bsky.video.getUploadLimits": {
      output: AppBskyVideoGetUploadLimits.Output;
    };
    "chat.bsky.actor.exportAccountData": {
      output: ChatBskyActorExportAccountData.Output;
    };
    "chat.bsky.convo.getConvo": {
      params: ChatBskyConvoGetConvo.Params;
      output: ChatBskyConvoGetConvo.Output;
    };
    "chat.bsky.convo.getConvoForMembers": {
      params: ChatBskyConvoGetConvoForMembers.Params;
      output: ChatBskyConvoGetConvoForMembers.Output;
    };
    "chat.bsky.convo.getLog": {
      params: ChatBskyConvoGetLog.Params;
      output: ChatBskyConvoGetLog.Output;
    };
    "chat.bsky.convo.getMessages": {
      params: ChatBskyConvoGetMessages.Params;
      output: ChatBskyConvoGetMessages.Output;
    };
    "chat.bsky.convo.listConvos": {
      params: ChatBskyConvoListConvos.Params;
      output: ChatBskyConvoListConvos.Output;
    };
    "chat.bsky.moderation.getActorMetadata": {
      params: ChatBskyModerationGetActorMetadata.Params;
      output: ChatBskyModerationGetActorMetadata.Output;
    };
    "chat.bsky.moderation.getMessageContext": {
      params: ChatBskyModerationGetMessageContext.Params;
      output: ChatBskyModerationGetMessageContext.Output;
    };
  }
  interface Procedures {
    "app.bsky.actor.putPreferences": {
      input: AppBskyActorPutPreferences.Input;
    };
    "app.bsky.feed.sendInteractions": {
      input: AppBskyFeedSendInteractions.Input;
      output: AppBskyFeedSendInteractions.Output;
    };
    "app.bsky.graph.muteActor": {
      input: AppBskyGraphMuteActor.Input;
    };
    "app.bsky.graph.muteActorList": {
      input: AppBskyGraphMuteActorList.Input;
    };
    "app.bsky.graph.muteThread": {
      input: AppBskyGraphMuteThread.Input;
    };
    "app.bsky.graph.unmuteActor": {
      input: AppBskyGraphUnmuteActor.Input;
    };
    "app.bsky.graph.unmuteActorList": {
      input: AppBskyGraphUnmuteActorList.Input;
    };
    "app.bsky.graph.unmuteThread": {
      input: AppBskyGraphUnmuteThread.Input;
    };
    "app.bsky.notification.putPreferences": {
      input: AppBskyNotificationPutPreferences.Input;
    };
    "app.bsky.notification.registerPush": {
      input: AppBskyNotificationRegisterPush.Input;
    };
    "app.bsky.notification.updateSeen": {
      input: AppBskyNotificationUpdateSeen.Input;
    };
    "app.bsky.video.uploadVideo": {
      input: AppBskyVideoUploadVideo.Input;
      output: AppBskyVideoUploadVideo.Output;
    };
    "chat.bsky.actor.deleteAccount": {
      output: ChatBskyActorDeleteAccount.Output;
    };
    "chat.bsky.convo.deleteMessageForSelf": {
      input: ChatBskyConvoDeleteMessageForSelf.Input;
      output: ChatBskyConvoDeleteMessageForSelf.Output;
    };
    "chat.bsky.convo.leaveConvo": {
      input: ChatBskyConvoLeaveConvo.Input;
      output: ChatBskyConvoLeaveConvo.Output;
    };
    "chat.bsky.convo.muteConvo": {
      input: ChatBskyConvoMuteConvo.Input;
      output: ChatBskyConvoMuteConvo.Output;
    };
    "chat.bsky.convo.sendMessage": {
      input: ChatBskyConvoSendMessage.Input;
      output: ChatBskyConvoSendMessage.Output;
    };
    "chat.bsky.convo.sendMessageBatch": {
      input: ChatBskyConvoSendMessageBatch.Input;
      output: ChatBskyConvoSendMessageBatch.Output;
    };
    "chat.bsky.convo.unmuteConvo": {
      input: ChatBskyConvoUnmuteConvo.Input;
      output: ChatBskyConvoUnmuteConvo.Output;
    };
    "chat.bsky.convo.updateRead": {
      input: ChatBskyConvoUpdateRead.Input;
      output: ChatBskyConvoUpdateRead.Output;
    };
    "chat.bsky.moderation.updateActorAccess": {
      input: ChatBskyModerationUpdateActorAccess.Input;
    };
  }
}
