import { ServerFacade } from "../../src/network/ServerFacade";
import { GetCountRequest, PagedStatusItemRequest, PagedUserItemRequest, RegisterRequest, StatusDto, UserDto } from "tweeter-shared";
import "isomorphic-fetch"

describe("ServerFacade", () => {
    const serverFacade = new ServerFacade();

    // beforeEach(() => {
            
    // });

    it("successfully registers a user", async () => {
        const req: RegisterRequest = {
            token: "testToken",
            userAlias: "@testAlias",
            firstName: "userName",
            lastName: "lastName",
            alias: "@test",
            password: "pass",
            imageBytes: "testImageUrl",
            imageFileExtension: "jpeg"
        };

        const [user, authToken] = await serverFacade.register(req);

        expect(user).toBeDefined();
        expect(authToken).toBeDefined();
    });

    it("gets followers", async () => {
        const userDto: UserDto = {
            firstName: "test",
            lastName: "test",
            alias: "test",
            imageUrl: "test"
        }
        const req: PagedUserItemRequest = {
            token: "testToken",
            userAlias: "@testAlias",
            pageSize: 10,
            lastItem: userDto
        }

        const [users, hasMore] = await serverFacade.getMoreFollowers(req);
        expect(users).toBeDefined();
    });

    it("gets following count", async () => {
        const userDto: UserDto = {
            firstName: "test",
            lastName: "test",
            alias: "test",
            imageUrl: "test"
        }
        const req: GetCountRequest = {
            token: "testToken",
            userAlias: "@testAlias",
            user: userDto
        }

        const followers = await serverFacade.getFollowerCount(req);
        expect(followers).toBeDefined();
    });

    it("gets page of stories", async () => {
        const userDto: UserDto = {
            firstName: "test",
            lastName: "test",
            alias: "test",
            imageUrl: "test"
        }
        const statusDto: StatusDto = {
            post: "post test",
            user: userDto,
            timestamp: Date.now()
        }
        const req: PagedStatusItemRequest = {
            token: "testToken",
            userAlias: "@testAlias",
            pageSize: 10,
            lastItem: statusDto
        }
        
        const [stories, hasMore] = await serverFacade.getMoreStories(req);
        expect(stories).toBeDefined();
    });
});