package rocks.zipcode.klasschat.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class UserProfileMapperTest {

    private UserProfileMapper userProfileMapper;

    @BeforeEach
    public void setUp() {
        userProfileMapper = new UserProfileMapperImpl();
    }
}
