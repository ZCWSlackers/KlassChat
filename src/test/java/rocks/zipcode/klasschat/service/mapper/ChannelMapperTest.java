package rocks.zipcode.klasschat.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ChannelMapperTest {

    private ChannelMapper channelMapper;

    @BeforeEach
    public void setUp() {
        channelMapper = new ChannelMapperImpl();
    }
}
