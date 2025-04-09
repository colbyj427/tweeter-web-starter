import { ServerFacade } from "../../src/network/ServerFacade";
import { anything, instance, mock, verify, when } from "@typestrong/ts-mockito";
import { PostStatusPresenter, PostStatusView } from "../../src/presenters/PostStatusPresenter";
import { GetCountRequest, PagedStatusItemRequest, PagedUserItemRequest, RegisterRequest, LoginRequest, StatusDto, UserDto } from "tweeter-shared";
import "isomorphic-fetch"

describe("Status Integration", () => {
    const serverFacade = new ServerFacade();

    it("posts a status and appends it to the user's story", async () => {
        // Mock the view that displays messages
        const mockView = mock<PostStatusView>();

        const presenter = new PostStatusPresenter(instance(mockView));

        // Login user
        const userDto: UserDto = {
            firstName: "Test",
            lastName: "User",
            alias: "@testuser",
            imageUrl: "test-url"
        };

        const req: LoginRequest = {
            token: "test",
            userAlias: "@colby",
            alias: "@colby",
            password: "p"
        };

        const [loggedInUser, authToken] = await serverFacade.login(req);

        const fakeEvent = {
            preventDefault: jest.fn(),
          } as unknown as React.MouseEvent;          

        // Post a new status
        const statusText = "This is a test status from Jest";
        await presenter.submitPost(
            fakeEvent,
            loggedInUser,
            authToken,
            statusText
        );

        // ✅ Verify the success message was shown
        verify(mockView.displayInfoMessage("Posting status...", 0)).once();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        verify(mockView.displayInfoMessage("Status posted!", 2000)).once();
        // ✅ Verify the status was appended to the user's story
        const storyReq: PagedStatusItemRequest = {
            token: authToken.token,
            userAlias: loggedInUser.alias,
            pageSize: 10,
            lastItem: null
        };

        const [story, hasMore] = await serverFacade.getMoreStories(storyReq);

        expect(story.length).toBeGreaterThan(0);

        const postedStatus = story.find(s => s.post === statusText);

        expect(postedStatus).toBeDefined();
        expect(postedStatus?.user.alias).toBe(loggedInUser.alias);
        expect(postedStatus?.user.firstName).toBe(loggedInUser.firstName);
        expect(postedStatus?.user.lastName).toBe(loggedInUser.lastName);
        expect(postedStatus?.user.imageUrl).toBe(loggedInUser.imageUrl);
    }, 10000);
});

// describe("ServerFacade", () => {
//     const serverFacade = new ServerFacade();

//     it("successfully registers a user", async () => {
//         const req: RegisterRequest = {
//             token: "testToken",
//             userAlias: "@testAlias",
//             firstName: "userName",
//             lastName: "lastName",
//             alias: "@test",
//             password: "pass",
//             imageBytes: "testImageUrl",
//             imageFileExtension: "jpeg"
//         };

//         const [user, authToken] = await serverFacade.register(req);

//         expect(user).toBeDefined();
//         expect(authToken).toBeDefined();
//     });

//     it("gets followers", async () => {
//         const userDto: UserDto = {
//             firstName: "test",
//             lastName: "test",
//             alias: "test",
//             imageUrl: "test"
//         }
//         const req: PagedUserItemRequest = {
//             token: "testToken",
//             userAlias: "@testAlias",
//             pageSize: 10,
//             lastItem: userDto
//         }

//         const [users, hasMore] = await serverFacade.getMoreFollowers(req);
//         expect(users).toBeDefined();
//     });

//     it("gets following count", async () => {
//         const userDto: UserDto = {
//             firstName: "test",
//             lastName: "test",
//             alias: "test",
//             imageUrl: "test"
//         }
//         const req: GetCountRequest = {
//             token: "testToken",
//             userAlias: "@testAlias",
//             user: userDto
//         }

//         const followers = await serverFacade.getFollowerCount(req);
//         expect(followers).toBeDefined();
//     });

//     it("gets page of stories", async () => {
//         const userDto: UserDto = {
//             firstName: "test",
//             lastName: "test",
//             alias: "test",
//             imageUrl: "test"
//         }
//         const statusDto: StatusDto = {
//             post: "post test",
//             user: userDto,
//             timestamp: Date.now()
//         }
//         const req: PagedStatusItemRequest = {
//             token: "testToken",
//             userAlias: "@testAlias",
//             pageSize: 10,
//             lastItem: statusDto
//         }
        
//         const [stories, hasMore] = await serverFacade.getMoreStories(req);
//         expect(stories).toBeDefined();
//     });
// });
